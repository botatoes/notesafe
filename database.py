import pymongo
from pymongo import *
from bson.objectid import ObjectId

client = MongoClient('localhost', 27017)
data = client.notesafe.data

def find_user_id(query):
	return data.find_one({'_id':ObjectId(query)})

def find_user_name(query):
	return data.find_one({'username':query})

def find_note_oid(query):
	return data.find_one({'id':query})

def find_note_id(query):
	return data.find_one({'_id':ObjectId(query)})

def add_note(title, content):
	return str(data.insert({"title":title, "content":content}))

def add_user(newuser):
	return str(data.insert(newuser))

def modify_id_value(ide, field, newvalue):
	data.update(
			{"_id": ObjectId(ide)},
			{"$set": {field:newvalue} }
			)
def delete_id(ide):
	data.remove({"_id": ObjectId(ide)})
			
def append_id_value(ide, field, newvalue):
	doclist=data.find_one({"_id": ObjectId(ide)})[field]
	doclist.append(newvalue)
	modify_id_value(ide, field, doclist)

def remove_id_value(ide, field, oldvalue):
	doclist=data.find_one({"_id": ObjectId(ide)})[field]
	doclist.remove(oldvalue)
	modify_id_value(ide, field, doclist)

def add_note(uid, title, content):
	nid=data.insert({"title":title, "content":content})
	append_id_value(uid, "notes", nid)
	return str(nid)

