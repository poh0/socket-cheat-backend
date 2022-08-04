import json
import socketio
import requests

sio = socketio.Client()

user = "62eb13c65cb199ccc479890d"

API_URL = "http://localhost:3000"

@sio.event
def connect():
    print("I'm connected!")
    sio.emit("addClient", user)
    print("Waiting for commander")

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    print("I'm disconnected!")

@sio.event
def message(data):
    print('I received a message!')

@sio.on('getOptions')
def get_options(data):
    print('Settings changed')
    print(data)


sio.connect(API_URL)
