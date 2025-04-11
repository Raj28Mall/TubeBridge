import os
from flask import Flask
from flask_cors import CORS, cross_origin
from auth import handle_google_oauth_exchange

CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route("/api/auth/google/exchange", methods=["POST", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)

def google_exchange_code_route():
    return handle_google_oauth_exchange()

if __name__ == "__main__":
    if not CLIENT_ID or not CLIENT_SECRET:
        print("---------------------------------------------------------")
        print("ERROR: Cannot start server. Google credentials not found.")
        print("Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set")
        print("in your .env file or environment variables.")
        print("---------------------------------------------------------")
    else:
        app.run(host="127.0.0.1", port=5000, debug=True)
