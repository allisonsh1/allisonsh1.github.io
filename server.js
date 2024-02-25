const express = require('express');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));

app.use(require('./server/routes/router'));

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running at http://localhost:${PORT}`);
    } else {
        console.log(`Server startup failed: ${error}`);
    }
});

module.exports = app;