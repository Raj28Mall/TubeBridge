from flask import Blueprint, jsonify, request
from db import users_collection
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from config import Config
from mail import send_email

manager = Blueprint('managers', __name__, url_prefix='/api') # url_prefix is optional

@manager.route('/managers', methods=['GET'])
def get_managers():
    """
    Get manager information, filtered by the logged-in user's Google ID.
    The logged-in user's ID token must be provided in the Authorization header.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization token is missing or invalid"}), 401

        token = auth_header.split('Bearer ')[1]

        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), Config.CLIENT_ID)
            logged_in_user_google_id = idinfo['sub']
        except ValueError as e:
            print(f"Token verification failed: {e}")
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"An error occurred during token verification: {e}")
            return jsonify({"error": "Token verification error"}), 500
        
        query_filter = {"admin_google_id": logged_in_user_google_id}

        managers = list(users_collection.find(query_filter))
        for m in managers:
            if '_id' in m:
                m['_id'] = str(m['_id'])

        return jsonify(managers), 200
    except Exception as e:
        print(f"Error fetching managers: {e}")
        return jsonify({"error": "Failed to fetch managers"}), 500

@manager.route('/managers', methods=['POST'])
def add_manager():
    """
    Add a new manager.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ["name", "email"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Insert the new manager into the database
        result = users_collection.insert_one(data)
        return jsonify({"message": "Manager added successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Error adding manager: {e}")
        return jsonify({"error": "Failed to add manager"}), 500
