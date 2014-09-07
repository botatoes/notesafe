import os
from flask import Flask, request, jsonify
from flask import render_template

import db
from db import *
import json

app = Flask(__name__)

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
		newuser={"username":name, "password":pw, "pubkey":None, "notes":[]}
		_id=add_user(newuser)
	return jsonify({"_id":_id, "key":"stub" , "error":error})

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
			note=find_note_id(n)
			if note != None:
				pairlist.insert(-1,{"id":n, "title":note['title']})

	return jsonify({"error":error, "list":pairlist})

# The note call
# Requires a POST request on the url /api-load

@app.route('/api-read', methods=['POST'])
def ns_load():
	noteid=str(request.json['_id'])
	seckey=str(request.json['key'])
	
	find_note_id(noteid)

	return jsonify({"id":noteid, "key":seckey})
