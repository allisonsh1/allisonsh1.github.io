const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const database = require('./server/scripts/database');

const app = express();
const PORT = 8080;

dotenv.config({ path: '.env'});

database.connect(process.env.MONGO_URI);

app.set('view engine', 'ejs');

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(require('./server/routes/router'));

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running`);
    } else {
        console.log(`Server startup failed: ${error}`);
    }
});

module.exports = app;
