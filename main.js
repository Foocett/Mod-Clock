const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/Public/index.html');
});

app.use(express.static('Public'));

app.listen(port, () => {
    console.log(`Web server running at http://localhost:${port}`);
});