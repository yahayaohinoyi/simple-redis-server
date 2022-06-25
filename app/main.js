const net = require("net");

const server = net.createServer((socket) => {
    socket.write("+PONG\r\n");
    socket.pipe(socket);
  });
  
  server.listen(6379, "127.0.0.1");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

