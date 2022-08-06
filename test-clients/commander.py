import json
import socketio
import requests
import time

sio = socketio.Client()

user = "62eb13c65cb199ccc479890d"

API_URL = "http://localhost:3000"

settings = {
    "bhop": True,
    "esp": True
}

def ask_bot_value():
    while True:
        input()
        settings["bhop"] = not settings["bhop"]
        settings["esp"] = not settings["esp"]
        print(settings)
        sio.emit("sendOptions", data=(user, settings))

@sio.event
def connect():
    print("I'm connected!")
    sio.emit("addCommander", user)
    ask_bot_value()

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    sio.emit("disconnectCommander")
    print("I'm disconnected!")

@sio.event
def message(data):
    print('I received a message!')

@sio.on('')
def on_message(data):
    print('I received a message!')

sio.connect(API_URL)
