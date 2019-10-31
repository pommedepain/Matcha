const express = require('express');
const debug = require('debug')('socket');
const http = require('http');
const _ = require('lodash');

const SERVER = {
  HOST: 'localhost',
  PORT: 5000,
}

const NOTIFICATION_TYPES = [
  'like',
  'match',
  'unlike',
  'visit',
  'message'
]

class Server {
  constructor() {
    // Server variables
    this.app = express()
    this.http = http.Server(this.app)

    // Sockets handler
    this.io = require('socket.io')(this.http, { pingTimeout: 60000 });
    this.socketTable = {}
    this.io.sockets.on('connection', (socket) => {
      socket.on('loginUser', (username) => {
        if (!_.isEmpty(username)) {
          if (_.isEmpty(this.socketTable[username])) {
            Object.assign(this.socketTable, { [username]: [socket.id] })
            debug(' New user connected', this.socketTable);
          } else {
            this.socketTable[username].push(socket.id);
            debug(` New socket for ${username}`, this.socketTable);
          }
        }
        
      })

      socket.on('logoutUser', (username) => {
        if (!_.isEmpty(this.socketTable[username])) {
          this.socketTable[username].forEach((socketId) => {
            this.io.to(`${socketId}`).emit('logout')
          })
        }
      })

      socket.on('notification', (notification) => {
        if (notification.type && NOTIFICATION_TYPES.indexOf(notification.type) > -1
        && notification.emitter && notification.receiver) {
          const receiver = notification.receiver;
          if (this.socketTable[receiver] !== undefined
          && this.socketTable[receiver].length) {
            this.socketTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('notification', {
                data: {
                  type: notification.type,
                  emitter: notification.emitter,
                },
              })
              debug('emitted', {
                type: notification.type,
                emitter: notification.emitter,
              });
            })
          }
        }
        const emitter = notification.emitter;
        if (notification.type === 'like') {
          if (this.correlationTable[emitter] !== undefined
          && this.correlationTable[emitter].length) {
            this.correlationTable[emitter].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('notification', {
                data: {
                  type: notification.type,
                  emitter: notification.receiver,
                },
              })
              debug('emitted', {
                type: notification.type,
                emitter: notification.receiver,
              });
            })
          }
        }
      })

      socket.on('isOnline', (usernameList) => {
        const onlineUsers = usernameList.map((username) => {
          let isOnline = false
          Object.keys(this.socketTable).forEach((key) => {
            if (key === username && !_.isEmpty(this.socketTable[key])) isOnline = true
          })
          return { id, isOnline }
        })
        this.io.to(`${socket.id}`).emit('isOnline', { data: { onlineUsers } })
      })

      // Handle chat messages
      socket.on('message', (message) => {
        if (message.emitter && message.receiver && message.content) {
          const receiver = message.receiver;
          if (this.socketTable[receiver]
          && this.socketTable[receiver].length) {
            this.socketTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('message', {
                data: {
                  content: message.content,
                  emitter: message.emitter,
                  receiver: message.receiver,
                },
              })
            })
          }
        }
      })

      socket.on('disconnect', () => {
        const key = _.findKey(this.socketTable, socketIds => (
          socketIds.indexOf(socket.id) > -1
        ))
        debug('user disconnected', this.socketTable);
        _.remove(this.socketTable[key], el => el === socket.id)
        debug('user disconnected', this.socketTable);
      })
    })
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

new Server().listen()

// const io = require('socket.io');
// const mySocket = io('http://localhost:5000')
// mySocket.emit('loginUser', username)