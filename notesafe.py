import os
from flask import Flask, request, jsonify
from flask import render_template

import db
from db import *
import json

app = Flask(__name__)

@app.route('/')
def root():
	return render_template('index.html')

# The login API
# Requires a POST request on the url /api-login

@app.route('/api-login', methods=['POST'])
def login():

	_id=None
	error=0 #No error
	name=request.json['username']
	pw=request.json['password']
	find=find_user_name(name)
	
	if len(name)<=0 or len(pw)<=0:
		error=1 #Please enter your username and password.
	elif find is None:
		error=2 #This user does not exist.
	elif find['password'] != pw:
		error=3 #Wrong username or password.
	else:
		_id=str(find['_id'])
	return jsonify({"_id":_id, "error":error})
