const express = require('express');
const http = require('http');

console.log('server startup');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));

app.use(require('./server/routes/router'));

console.log('setup finished');

let ipv4;
const requestListener = function (req, res) {
  ipv4 = req.socket.localAddress;
};

app.listen(PORT, "0.0.0.0");
console.log(`App listening @ ${ipv4}:4${PORT}`);

/*
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running at http://localhost:${PORT}`);
    } else {
        console.log(`Server startup failed: ${error}`);
    }
});
*/

module.exports = app;
