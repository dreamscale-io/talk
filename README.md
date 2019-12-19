# talkServer
Realtime P2P Router

# How to Setup & Run
First, use the latest stable version of Node.  It changes stupid fast.  We try to stay current, fix what breaks.

`nvm use stable`

Next, install all the node modules with yarn.

`yarn install`

To run the app, we use the heroku client that runs the Procfile

`heroku local web`

## Specificiation:
- Store socket and session for torchie clients
- use -> https://github.com/wcamarao/session.socket.io
- Create socket layer for talkServer commands and messaging
- Create API for broadcast notification to all clients
- Create API for private notification to a specific client
- Create API for private message to a specific client
- Create API for creating new rooms
- Create API for destroying rooms
- Create API for sending message to room
