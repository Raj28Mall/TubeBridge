import os
from pymongo import MongoClient
from dotenv import load_dotenv
from config import Config

load_dotenv()

client = MongoClient(Config.MONGO_URI)
db = client[Config.DATABASE_NAME]
users_collection = db["users"]
videos_collection = db["videos"]
managers_collection = db["managers"]
