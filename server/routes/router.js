const express = require('express');
const mail = require('../scripts/mail');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const data = req.body;
    if (!data.firstName || !data.lastName || !data.email) {
        res.status(400).end();
    }

    mail.sendEmail('New Registrant!', `First Name: ${data.firstName}\nLast Name: ${data.lastName}\nEmail: ${data.email}`);
});

module.exports = router;