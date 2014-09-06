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
	error=None

	if not 'username' in request.json or not 'password' in request.json:
		error="Please enter both your username and password!"
	elif find_user_username(request.json['username']) == None:
		error="This user does not exist!"
	elif find_user_user(jn['username'])['password'] !=request.json['password']:
		error="You entered the wrong password!"
	else:
		_id=find_username(request.json['username'])
	
	return jsonify({"_id":str(_id), "error":error})
