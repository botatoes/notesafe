Note Safe
=========

A web app for securely storing user's notes using RSA encryption.
A private/public key pair is generate at account creation and the public key pair is ued to encrypt the user information.

Installation
------------
To start developing the app, you will need to be in a UNIX environment (iOS or Linux) with the following tools installed

virtualenv	(To emulate a virtual environment)
python 2.7
pip 		(python package manager)
Flask		(installed using pip)
pymongo		(installed using pip)
gunicorn	(installed using pip)

To run the app, first start the virtualenv

	$ source /venv/bin/activate

Then install the appropriate libraries with pip (listed above). Run the app

	$ foreman start

Terminate the app by pressing control+c (NOTE! ONLY TERMINATE YOUR APP THIS WAY OR IT WOULDNT KILL THE PROCESS)
