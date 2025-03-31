import os
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin # For handling requests from frontend origin
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv 
from pymongo import MongoClient 
load_dotenv() 

REFRESH_TOKEN_AGE=60*60*24*30 #
CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
MONGO_URI = "mongodb://localhost:27017/"  
DATABASE_NAME = "TubeBridge"     
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db["users"]

EXPECTED_REDIRECT_URI = "http://localhost:3000/auth/google/callback"
TOKEN_URL = "https://oauth2.googleapis.com/token"

if not CLIENT_ID or not CLIENT_SECRET:
    print("FATAL ERROR: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables must be set.")
    #Exit in production

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route("/api/auth/google/exchange", methods=["POST", "OPTIONS"]) 
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True) 
def google_exchange_code():
    """
    Handles the POST request from the frontend containing the authorization code.
    Exchanges the code for tokens, verifies the ID token, and returns user info.
    """
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid JSON payload"}), 400

            auth_code = data.get("code")
            role_from_frontend = data.get("role")

            if not auth_code:
                return jsonify({"error": "Missing authorization code in request body"}), 400
            token_payload = {
                'code': auth_code,
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'redirect_uri': EXPECTED_REDIRECT_URI, 
                'grant_type': 'authorization_code'
            }
            token_response = requests.post(TOKEN_URL, data=token_payload, timeout=10) 
            token_response.raise_for_status() 

            token_data = token_response.json()
            id_token_jwt = token_data.get('id_token')
            access_token = token_data.get('access_token') 
            refresh_token = token_data.get('refresh_token')

            if not id_token_jwt:
                print("Error: ID token not found in Google's response.") 
                return jsonify({"error": "ID token not received from Google"}), 502 

            try:
                idinfo = id_token.verify_oauth2_token(id_token_jwt, google_requests.Request(), CLIENT_ID)

                user_google_id = idinfo['sub']
                user_email = idinfo['email']
                user_name = idinfo.get('name', '')
                user_picture = idinfo.get('picture', '')
                email_verified = idinfo.get('email_verified', False)

                if not email_verified:
                   return jsonify({"error": "User email not verified by Google"}), 403
                
                user_data = users_collection.find_one({"google_id": user_google_id})

                if user_data:
                    update_data = {"name": user_name, "picture": user_picture.replace("s96-c", "s400-c"), "email": user_email}
                    if refresh_token:
                        update_data["refresh_token"] = refresh_token
                    users_collection.update_one(
                        {"google_id": user_google_id},
                        {"$set": update_data}
                    )
                    final_user_role = user_data.get("role")
                    print("This is final user role in backend: ", final_user_role)
                    user_id_in_db = str(user_data["_id"])
                else:
                    new_user = {
                        "google_id": user_google_id,
                        "email": user_email,
                        "name": user_name,
                        "picture": user_picture,
                        "email_verified": email_verified,
                        "role": role_from_frontend,
                        "refresh_token": refresh_token  
                    }
                    inserted_user = users_collection.insert_one(new_user)
                    final_user_role = role_from_frontend
                    user_id_in_db = str(inserted_user.inserted_id)

                print(f"Login successful for {user_email}. Assigned role: {final_user_role}") # Debug print
                response = make_response(jsonify({
                "status": "success",
                "message": "Authentication successful",
                "user": {
                    "email": user_email,
                    "name": user_name,
                    "picture": user_picture,
                    "role": final_user_role
                },
                "access_token": access_token  # Send access token in JSON
            }))
                response.set_cookie(
                    key="refresh_token",
                    value=refresh_token,
                    httponly=True, 
                    secure=True,  
                    samesite="Strict",  
                    max_age=REFRESH_TOKEN_AGE
                )
                return response

            except ValueError as e:
                print(f"ID token verification failed: {e}")
                return jsonify({"error": "Invalid ID token. Verification failed."}), 401 

        except requests.exceptions.HTTPError as e:
            error_details = "Unknown error during token exchange."
            status_code = 502 
            if e.response is not None:
                status_code = e.response.status_code
                try:
                    error_details = e.response.json()
                except ValueError: 
                    error_details = e.response.text
            print(f"HTTPError during token exchange: {status_code} - {error_details}")
            return jsonify({"error": "Failed to exchange code with Google", "details": error_details}), status_code

        except requests.exceptions.RequestException as e:
            print(f"Network error during token exchange: {e}")
            return jsonify({"error": "Network error communicating with Google"}), 504

        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return jsonify({"error": "An internal server error occurred"}), 500
    else:
        return jsonify({"error": "Method not allowed bhadwe"}), 405


if __name__ == "__main__":
    if not CLIENT_ID or not CLIENT_SECRET:
        print("---------------------------------------------------------")
        print("ERROR: Cannot start server. Google credentials not found.")
        print("Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set")
        print("in your .env file or environment variables.")
        print("---------------------------------------------------------")
    else:
        app.run(host="127.0.0.1", port=5000, debug=True)