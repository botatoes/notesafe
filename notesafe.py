import os
from flask import Flask, request
from flask import render_template

app = Flask(__name__)

@app.route('/')
def root():
	return render_template('index.html')

