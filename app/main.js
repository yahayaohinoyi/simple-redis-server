const net = require("net");
const store = new Map();

function makePingResponse(request) {
    const DEFAULT = "+PONG\r\n";
    const COMMAND = request[2];
    const DATAKEY = request[4];
    const OK = "+OK\r\n";
    const EXPIRY = request[8] || '';
    const EXPIREDBY = EXPIRY ? parseInt(request[10]) + (new Date()).getTime() : Infinity;

    switch(COMMAND) {
        case 'ping':
            return "+PONG\r\n";
        case 'echo':
            return `+${DATAKEY}\r\n`;
        case 'set':
            store.set(DATAKEY, {value: request[6], expiredBy: EXPIREDBY});
            return OK;
        case 'get':
            const result = store.get(DATAKEY);
            console.log(`${new Date().getTime()} ---- ${result.expiredBy}`)
            if ((new Date()).getTime() < result.expiredBy) {
                return `+${result.value}\r\n`;
            } else {
                return `$-1\r\n`;
            }
        default:
            return DEFAULT;
    }
}

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        const req = data.toString()
        const array = req.split('\r\n')
        console.log(array)
        const pingResponse = makePingResponse(array);
        socket.write(pingResponse);
    })
    socket.on('end', socket.end)
  });
  
  server.listen(6379, "127.0.0.1");
