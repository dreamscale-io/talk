# talkServer
Realtime P2P Router

# How to Setup & Run
First, use the latest stable version of Node.  It changes stupid fast.  We try to stay current, fix what breaks.

`nvm use stable`

Next, install all the node modules with yarn.

`yarn install`

To run the express, we use the heroku client that runs the Procfile

`heroku local web`

Once running you may view the servers status by going to 

`http|s://admin:p@ssw0rd123@<your_host>/status`

NOTE: use 'AUTH=<your_host>/account/connect' for your own custom authentication server. See 'Procfile' for more information.

## Specificiation:
- Store socket and session for torchie clients
- caches connection id to socket id map
- use -> https://github.com/wcamarao/session.socket.io
- Create socket layer for talkServer commands and messaging
- Create API for broadcast notification to all clients
- Create API for private notification to a specific client
- Create API for private message to a specific client
- Create API for creating new rooms
- Create API for destroying rooms
- Create API for sending message to room
 
