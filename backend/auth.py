import os
import requests
from flask import request, jsonify, make_response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from pymongo import MongoClient
from dotenv import load_dotenv
from db import users_collection
from config import Config
    
def handle_google_oauth_exchange():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        auth_code = data.get("code")
        role_from_frontend = data.get("role")

        if not auth_code:
            return jsonify({"error": "Missing authorization code in request body"}), 400

        # Exchange code for tokens
        token_payload = {
            'code': auth_code,
            'client_id': Config.CLIENT_ID,
            'client_secret': Config.CLIENT_SECRET,
            'redirect_uri': Config.EXPECTED_REDIRECT_URI,
            'grant_type': 'authorization_code'
        }
        token_response = requests.post(Config.TOKEN_URL, data=token_payload, timeout=10)
        token_response.raise_for_status()

        token_data = token_response.json()
        id_token_jwt = token_data.get('id_token')
        access_token = token_data.get('access_token')
        refresh_token = token_data.get('refresh_token')

        if not id_token_jwt:
            print("Error: ID token not found in Google's response.")
            return jsonify({"error": "ID token not received from Google"}), 502

        idinfo = id_token.verify_oauth2_token(id_token_jwt, google_requests.Request(), Config.CLIENT_ID)

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
            users_collection.update_one({"google_id": user_google_id}, {"$set": update_data})
            final_user_role = user_data.get("role")
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

        response = make_response(jsonify({
            "status": "success",
            "message": "Authentication successful",
            "user": {
                "id": user_id_in_db,
                "email": user_email,
                "name": user_name,
                "picture": user_picture,
                "role": final_user_role
            },
            "access_token": access_token,
            "id_token": id_token_jwt,
        }))
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="Strict",
            max_age=Config.REFRESH_TOKEN_AGE
        )
        return response

    except ValueError as e:
        print(f"ID token verification failed: {e}")
        return jsonify({"error": "Invalid ID token. Verification failed."}), 401

    except requests.exceptions.HTTPError as e:
        error_details = "Unknown error during token exchange."
        status_code = e.response.status_code if e.response else 502
        try:
            error_details = e.response.json()
        except Exception:
            error_details = e.response.text if e.response else str(e)
        print(f"HTTPError during token exchange: {status_code} - {error_details}")
        return jsonify({"error": "Failed to exchange code with Google", "details": error_details}), status_code

    except requests.exceptions.RequestException as e:
        print(f"Network error during token exchange: {e}")
        return jsonify({"error": "Network error communicating with Google"}), 504

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal server error"}), 500
