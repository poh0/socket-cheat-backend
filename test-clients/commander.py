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
        sio.emit("sendOptions", settings)

@sio.event
def connect():
    print("I'm connected!")
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

res = requests.post(API_URL + '/api/users/authenticate', {
    'email': 'test@cheat.dev',
    'password': '123'
})

token = res.json()['token']
print(token)
sio.connect(API_URL + '?token=' + token + "&type=commander")