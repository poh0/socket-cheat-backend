import json
import socketio
import requests
import time

sio = socketio.Client()

user = "62eb13c65cb199ccc479890d"

API_URL = "http://localhost:3000"

@sio.event
def connect():
    print("I'm connected!")
    sio.emit("addCommander", user)
    time.sleep(2)
    sio.emit("sendOptions", {
        "senderId": user,
        "options": "aimbot: on"
    })

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    print("I'm disconnected!")

@sio.event
def message(data):
    print('I received a message!')

@sio.on('')
def on_message(data):
    print('I received a message!')

sio.connect(API_URL)
