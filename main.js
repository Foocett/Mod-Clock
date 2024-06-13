const port = 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/Public/index.html');
});
app.use(express.static('Public'));

io.on("connection", (socket) => {
    socket.on("test", () => {
        console.log("test")
    })
    console.log("skdjflj")
});

server.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
})