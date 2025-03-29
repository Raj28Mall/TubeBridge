from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
import os
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv
import logging
logging.basicConfig(level=logging.DEBUG)

PORT=5000
load_dotenv()

app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})
app.secret_key = os.getenv("SECRET_KEY") 

with open("client_secret.json", "r") as f:
    google_config = json.load(f)["web"]

CLIENT_ID = google_config["client_id"]
CLIENT_SECRET = google_config["client_secret"]
REDIRECT_URI = "http://127.0.0.1:5000/auth/callback"
TOKEN_URI = "https://oauth2.googleapis.com/token"
USER_INFO_URI = "https://www.googleapis.com/oauth2/v2/userinfo"

# @app.route("/auth/callback", methods=["POST"])
# def callback():
#     try:
#         data = request.json
#         auth_code = data.get("code")
#         role = data.get("role")  

#         if not auth_code:
#             return jsonify({"error": "Missing authorization code"}), 400

#         token_data = {
#             "code": auth_code,
#             "client_id": CLIENT_ID,
#             "client_secret": CLIENT_SECRET,
#             "redirect_uri": REDIRECT_URI,
#             "grant_type": "authorization_code",
#         }
#         token_res = requests.post(TOKEN_URI, data=token_data)
#         token_json = token_res.json()

#         if "error" in token_json:
#             return jsonify({"error": token_json["error"]}), 400

#         access_token = token_json["access_token"]
#         id_token_jwt = token_json["id_token"]

#         # Verify ID Token
#         id_info = id_token.verify_oauth2_token(id_token_jwt, google_requests.Request(), CLIENT_ID)

#         # Fetch user info
#         user_info = requests.get(USER_INFO_URI, headers={"Authorization": f"Bearer {access_token}"}).json()

#         # Store user session (Example: Modify as needed)
#         session["user"] = user_info
#         session["role"] = role  # Store role selected in frontend

#         return jsonify({
#             "message": "Authentication successful",
#             "user": user_info,
#             "role": role
#         })
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

@app.route("/auth/callback", methods=["GET", "POST"])
def google_auth_callback():
    if request.method == "GET":
        # Extract auth code from URL params
        auth_code = request.args.get("code")
        if not auth_code:
            return jsonify({"error": "Missing auth code"}), 400
        
        return jsonify({"message": "Auth code received", "code": auth_code})

    elif request.method == "POST":
        data = request.json
        auth_code = data.get("code")
        if not auth_code:
            return jsonify({"error": "Missing auth code"}), 400
        
        return jsonify({"message": "Auth code received via POST", "code": auth_code})


if __name__ == "__main__":
    app.run(port=PORT, debug=True)
