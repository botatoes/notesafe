import pymongo
from pymongo import *
from bson.objectid import ObjectId

_client = MongoClient('notesafedb.cloudapp.net', 27017)
_db = _client.notesafe

_users = _db.Users
_notes = _db.Notes

def find_user_id(_id):
	return _users.find({'_id':ObjectId(_id)})[0]

def find_user_name(username):
	return _user.find({'username':usersame})[0]
