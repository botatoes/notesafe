import pymongo
from pymongo import *

client=MongoClient('notesafedb.cloudapp.net', 27017)

db1=client.notesafe.USERS
db2=client.encrypt.NOTES

usernames=['admin', 'test1', 'test2', 'test3']
passwords=['pw','test1','test2','test3']
publickeys=['','','','']
notes=[[],[],[],[]]

for i in range(4):
	newuser={
			"username":usernames[i],
			"password":passwords[i],
			"pubkey":publickeys[i],
			"notes":notes[i]
		}
	db1.insert(newuser)

titles=['title1', 'title2', 'title3']
contents=['content in the stuffs1', 'content in the stuffs2', 'content in the stuffs3']

for i in range(3):
	newnote={
			"title":titles[i],
			"content":contents[i]
			}
	nid=db2.insert(newnote)
	db1.find_one({"username":"admin"})['notes'].insert(-1, nid)

