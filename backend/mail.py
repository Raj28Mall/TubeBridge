import base64
import pickle
import os.path
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from dotenv import load_dotenv

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
load_dotenv()
CREDENTIALS_FILE = os.environ.get("CLIENT_SECRET_FILE")
TOKEN_PICKLE_FILE = os.environ.get("TOKEN_PICKLE_FILE")

def load_credentials():
    creds = None
    if os.path.exists(TOKEN_PICKLE_FILE):
        with open(TOKEN_PICKLE_FILE, "rb") as token_file:
            creds = pickle.load(token_file)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"Error: {CREDENTIALS_FILE} not found. Please download it from Google Cloud Console and place it in the same directory as this script.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PICKLE_FILE, "wb") as token_file:
            pickle.dump(creds, token_file)
    return creds

def send_email(subject, message_body, to_email):
    creds = load_credentials()
    if not creds:
        print("Could not load credentials. Email not sent.")
        return False
    service = build("gmail", "v1", credentials=creds)

    message = MIMEText(message_body)
    message["to"] = to_email
    message["subject"] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    final_mail = {"raw": raw_message}

    try:
        service.users().messages().send(userId="me", body=final_mail).execute()
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False