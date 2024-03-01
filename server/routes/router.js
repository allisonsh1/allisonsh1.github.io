const express = require('express');
const Registrant = require('../models/registrant');
const ejs = require('ejs');
const path = require('path');
// const mail = require('../scripts/mail');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/home', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/admin', (req, res) => {
    const password = req.body.password;

    if (password == process.env.ADMIN_PASSWORD) {
        const viewPath = path.join(__dirname, '../../views/adminView.ejs');
        ejs.renderFile(viewPath, async (err, str) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            let registrants;
            try {
                registrants = await Registrant.find({});
            } catch (err) {
                console.log(err);
                res.status(500).end();
                return;
            }

            res.json({ success: true, data: str, registrants });
        });
    }
});

router.post('/register', async (req, res) => {
    const data = req.body;
    if (!data.firstName || !data.lastName || !data.email) {
        res.status(400).end();
    }

    let newRegistrant;
    try {
        newRegistrant = new Registrant({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        });
    } catch (err) {
        console.log(err);
        res.status(500).end();
        return;
    }

    try {
        newRegistrant.save();
    } catch (err) {
        console.log(err);
        res.status(500).end();
        return;
    }

    res.status(200).end();
});

module.exports = router;