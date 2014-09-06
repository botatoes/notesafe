import os
from flask import Flask, request
from flask import render_template

app = Flask(__name__)

@app.route('/')
def root():
	return render_template('index.html')

# The login API
# Requires a POST request on the url /api-login

@app.route('/api-login', methods=['POST'])
def login():

	error=None
	if not request.json or not 'username' in request.json or not 'password' in request.json:
		error="Please enter both your username and password!"
	
	elif 1>0:
		error="User does not exist!"
	
	elif 2>0:
		error="Wrong password!"
	
	else:
		return {"_id":"id", "error":None}
	


