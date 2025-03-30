import os
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin # For handling requests from frontend origin
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv 
from pymongo import MongoClient 
load_dotenv() 

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

            print(f"Received auth code. Role from frontend: {role_from_frontend}") # Debug print

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
                print("Error: ID token not found in Google's response.") # Debug print
                return jsonify({"error": "ID token not received from Google"}), 502 # Bad Gateway (error from upstream)

            print("Verifying ID token...") # Debug print
            try:
                idinfo = id_token.verify_oauth2_token(
                    id_token_jwt, google_requests.Request(), CLIENT_ID)

                user_google_id = idinfo['sub']
                user_email = idinfo['email']
                user_name = idinfo.get('name', '')
                user_picture = idinfo.get('picture', '')
                email_verified = idinfo.get('email_verified', False)

                # Optional: Add check for email_verified if required by your app
                # if not email_verified:
                #    return jsonify({"error": "User email not verified by Google"}), 403

                print(f"ID token verified successfully for {user_name}: {user_email}") # Debug print

                 # 4. Interact with MongoDB to find or create the user
                user_data = users_collection.find_one({"google_id": user_google_id})

                if user_data:
                    # User exists, update their info and potentially the refresh token
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

                # 5. --- Placeholder: Session Management / JWT Generation ---
                #    - Create a session for the user (e.g., using Flask sessions)
                #      session['user_id'] = user_id_in_db
                #      session['user_role'] = final_user_role
                #    - OR Generate a JWT for your frontend to store
                #      app_jwt = create_your_app_jwt(user_id=user_id_in_db, email=user_email, role=final_user_role)

                # 6. Send success response back to the frontend
                print(f"Login successful for {user_email}. Assigned role: {final_user_role}") # Debug print
                return jsonify({
                    "status": "success",
                    "message": "Authentication successful",
                    "user": {
                        # Send back relevant, non-sensitive user info
                        "email": user_email,
                        "name": user_name,
                        "picture": user_picture,
                        "role": final_user_role # Send the role determined by the backend
                    },
                    # If using JWTs, include it in the response:
                    # "token": app_jwt
                }), 200

            except ValueError as e:
                # Catches errors from id_token.verify_oauth2_token (invalid format, signature, expiry, audience etc.)
                print(f"ID token verification failed: {e}")
                return jsonify({"error": "Invalid ID token. Verification failed."}), 401 # Unauthorized

        except requests.exceptions.HTTPError as e:
            # Handle specific errors from the token exchange request (4xx, 5xx from Google)
            error_details = "Unknown error during token exchange."
            status_code = 502 # Bad Gateway (error from upstream service)
            if e.response is not None:
                status_code = e.response.status_code
                try:
                    error_details = e.response.json()
                except ValueError: # If Google's error response wasn't JSON
                    error_details = e.response.text
            print(f"HTTPError during token exchange: {status_code} - {error_details}")
            return jsonify({"error": "Failed to exchange code with Google", "details": error_details}), status_code

        except requests.exceptions.RequestException as e:
            # Handle network errors (DNS failure, connection refused, timeout etc.)
            print(f"Network error during token exchange: {e}")
            return jsonify({"error": "Network error communicating with Google"}), 504 # Gateway Timeout or 502

        except Exception as e:
            # Catch any other unexpected errors
            print(f"An unexpected error occurred: {e}")
            # Log the full traceback in a real app: import traceback; traceback.print_exc()
            return jsonify({"error": "An internal server error occurred"}), 500
    else:
         # Should not happen if only POST is expected after CORS handling
        return jsonify({"error": "Method not allowed bhadwe"}), 405


# --- Run the App ---
if __name__ == "__main__":
    # Check again if credentials seem loaded before starting
    if not CLIENT_ID or not CLIENT_SECRET:
        print("---------------------------------------------------------")
        print("ERROR: Cannot start server. Google credentials not found.")
        print("Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set")
        print("in your .env file or environment variables.")
        print("---------------------------------------------------------")
    else:
        app.run(host="127.0.0.1", port=5000, debug=True)