import json
import socketio
import requests

sio = socketio.Client()

user = "62eb13c65cb199ccc479890d"

API_URL = "http://localhost:3000"

@sio.event
def connect():
    print("I'm connected!")
    sio.emit("addClient")
    print("Waiting for commander")

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    sio.emit("disconnectClient")
    print("I'm disconnected!")

@sio.event
def message(data):
    print('I received a message!')

@sio.on('getOptions')
def get_options(data):
    print('Settings changed')
    print(data)

@sio.on('commanderConnected')
def commander_connected():
    print('Commander connected!')

@sio.on('commanderDisconnected')
def commander_disconnect():
    print('Commander disconnected')
    print('Waiting for commander')

res = requests.post(API_URL + '/api/users/authenticate', {
    'email': 'test@cheat.dev',
    'password': '123'
})

token = res.json()['token']

sio.connect(API_URL + '?token=' + token + "&type=client")
