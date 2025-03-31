const { WebSocketServer } = require('ws');
const recommendStorage = {}

function peerProxy(httpServer) {
  // Create a websocket object
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.userID = null;

    socket.on('register', (userID) => {
        socket.userID = userID;
        if (recommendStorage[userID]) {
            recommendStorage[userID].forEach((recommendation) => {
                socket.send(recommendation);
            });
            delete recommendStorage[userID];
        }
    });

    // Forward messages to intended user
    socket.on('message', function message(data) {
      const parsedData = JSON.parse(data);
      const { recipientID, bookTitle } = parsedData; //// need to make sure the data is in this form when sent in the front end code!!!!!!

      socketServer.clients.forEach((client) => {
        if (client.userID === recipientID && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ senderID: socket.userID, bookTitle }));
        }
      });

      if (!Array.from(socketServer.clients).some((client) => client.userID === recipientID && client.readyState === WebSocketServer.OPEN)) {
        if (!recommendStorage[recipientID]) {
            recommendStorage[recipientID] = [];
        }
        recommendStorage[recipientID.push(JSON.stringify({ senderID: socket.userID, bookTitle }))]
      }
    });

    // Respond to pong messages by marking the connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Periodically send out a ping message to make sure clients are alive
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}

module.exports = { peerProxy };
