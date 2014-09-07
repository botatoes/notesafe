import pymongo
from pymongo import *
from bson.objectid import ObjectId

client = MongoClient('notesafedb.cloudapp.net', 27017)
db = client.notesafe

users = db.Users
notes = db.Notes

def find_user_id(query):
	return users.find_one({'_id':ObjectId(query)})

def find_user_name(query):
	return users.find_one({'username':query})

def find_note_id(query):
	return notes.find_one({'_id':ObjectId(query)})

def add_user(newuser):
	return str(users.insert(newuser))
