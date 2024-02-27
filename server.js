const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));

app.use(bodyParser.json());

app.use(require('./server/routes/router'));

app.listen(PORT, '0.0.0.0', (error) => {
    if (!error) {
        console.log(`Server running at http://${ip.address()}:${PORT}`);
    } else {
        console.log(`Server startup failed: ${error}`);
    }
});

module.exports = app;
