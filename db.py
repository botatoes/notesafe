import pymongo
from pymongo import *
from bson.objectid import ObjectId

client = MongoClient('notesafedb.cloudapp.net', 27017)
db = client.notesafe

users = db.Users
notes = db.Notes

def find_user_id(query):
	cursor=users.find({'_id':ObjectId(query)})
	if cursor.count()>0:
		return cursor[0]
	else:
		return None

def find_user_name(query):
	cursor=users.find({'username':query})
	if cursor.count()>0:
		return cursor[0]
	else:
		return None
