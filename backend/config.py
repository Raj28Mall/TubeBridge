import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    REFRESH_TOKEN_AGE = 60 * 60 * 24 * 30
    CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
    CLIENT_SECRET = os.environ["GOOGLE_CLIENT_SECRET"]
    MONGO_URI = os.environ.get("MONGO_URI")
    DATABASE_NAME = os.environ.get("DATABASE_NAME")
    EXPECTED_REDIRECT_URI = os.environ.get("EXPECTED_REDIRECT_URI")
    TOKEN_URL = os.environ.get("TOKEN_URL")