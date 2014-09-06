import os
from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('/content/index.html', title='Note Safe - A anonymous note storage app')

