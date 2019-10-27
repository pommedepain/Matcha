import socketIO from 'socket.io';

class DemoSocket {

  constructor(http) {
    this.sockets = [];
    this.http = http;
    this.io = socketIO(http, { pingTimeout: 60000 });
  }

  listen() {

    this.io.sockets.on('connection', (socket) => {

      // debug
      console.log(`[connection] ${socket.id} is now connected`);

      socket.on('identyUser', (userId) => {
        this.sockets.push({ socket: socket.id, user: userId });
      })

      socket.on("messageSend", ({ from, message }))

      // Disconnect: event predefini
      socket.on('disconnect', () => {

        // On retire la socket de la liste
        this.sockets = this.sockets.filter(el => el.socket !== socket.id);

        console.log(`[disconnect] ${socket.id} has disconnect`);
      });
    })

  }
}

export default DemoSocket;


/**
 * Cote front
 */
const dataobj = {
  someDate: 2,
};


socket.emit('messageSend', { to: userId, message: "A super message" });

socket.on('messageReceived', (payload) => {
  console.log(`Message recu de ${payload.from}: ${payload.message}`)
})
