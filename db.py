import pymongo
from pymongo import *
from bson.objectid import ObjectId

client = MongoClient('notesafedb.cloudapp.net', 27017)
data = client.notesafe.data

def find_user_id(query):
	return data.find_one({'_id':ObjectId(query)})

def find_user_name(query):
	return data.find_one({'username':query})

def find_note_id(query):
	return data.find_one({'_id':ObjectId(query)})

def add_user(newuser):
	return str(data.insert(newuser))
