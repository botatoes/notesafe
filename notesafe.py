import os
from flask import Flask, request, jsonify
from flask import render_template

import database
from database import *
import json

import encryption
from encryption import Encryptor

app = Flask(__name__)
e = Encryptor()

@app.route('/')
def ns_root():
	return render_template('index.html')

# The login call
# Requires a POST request on the url /api-login
@app.route('/test')
def ns_test():
	return jsonify(request.json)

@app.route('/api-login', methods=['POST'])
def ns_login():

	_id=None
	error=0 #No error
	name=request.json['username']
	pw=request.json['password']
	find=find_user_name(name)

	if len(name)<=0 or len(pw)<=0:
		error=1

	elif find == None:
		error=2

	elif find['password'] != pw:
		error=3
	else:
		_id=str(find['_id'])

	return jsonify({"_id":_id, "error":error})

# The create call
# Requires a POST request on the url /api-create

@app.route('/api-create', methods=['POST'])
def ns_create():

	_id=None
	error=0 #No error
	name=request.json['username']
	pw=request.json['password']
	find=find_user_name(name)

	if len(name)<=0 or len(pw)<=0:
		error=1 #You must enter a username or pw
	elif find is not None:
		error=2 #Username is already taken
	else:
		keys=e.keygen()
		newuser={"username":name, "password":pw, "pubkey":str(keys[0]), "notes":[]}
		_id=add_user(newuser)
	return jsonify({"_id":_id, "key":str(keys[1]) , "error":error})

# The list call
# Requires a POST request on the url /api-note

@app.route('/api-notes', methods=['POST'])
def ns_notes():
	userid=request.json['_id']
	seckey=request.json['key']
	error=0
	user=find_user_id(userid)
	pairlist=[]

	if user == None:
		error=1
	elif len(seckey)<=0:
		error=2
	else:
		nlist=user['notes']
		for n in nlist:
			note=find_note_oid(n)
			if note != None:
				pairlist.append({"id":n, "title":note['title']})

	return jsonify({"error":error, "list":pairlist})

# The note call
# Requires a POST request on the url /api-read

@app.route('/api-read', methods=['POST'])
def ns_read():
	noteid=str(request.json['_id'])
	seckey=str(request.json['key'])
	
	datnote=find_note_oid(noteid)

	return jsonify({"title":datnote['title'], "content":datnote['content']})

# The create new note call and edit note call
# Requirs a POST request on the url /api-write. If a note id is not provided, a new note will be created

@app.route('/api-write', methods=['POST'])
def ns_write():
		# Create new shit
		uid = request.json['_id']
		#pubkey = find_user_id(uid)['pubkey']
		title = request.json['title']
		content = request.json['content']
		nid=request.json['nid']
		
		if len(nid)<=0:
			nid=add_note(uid, title, content)
			return jsonify({"nid":nid})
		else:
			modify_id_value(nid, "title", title)
			modify_id_value(nid, "content", content)
			return jsonify({"nid":nid})

@app.route('/api-delete', methods=['POST'])
def ns_delete():
	ide = request.json['_id']
	nid = request.json['nid']
	find = find_note_id(nid)
	error = 0
	if find==None:
		error=1
	else:
		remove_id_value(ide, "notes", nid)
		delete_id(nid)
	return jsonify({"error":error})
