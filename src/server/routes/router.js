const express = require('express');
const Registrant = require('../models/registrant');
const ejs = require('ejs');
const path = require('path');

// Requirements for posts (specifically signup, posts should be moved to their own place)
const validator = require('../scripts/validator');
const User = require('../models/user');
const uuid = require('../scripts/uuid');
const { hash } = require('../scripts/crypter');
const cookies = require('../scripts/cookies');
const constants = require('../global/constants');
const auth = require('../scripts/auth');

const router = express.Router();

/* ------------------------ */
/* GET REQUESTS */
/* ------------------------ */

router.get('/', auth.loggedIn, (req, res) => {
    res.render('index',  { loggedIn: req.loggedIn });
});

router.get('/about', auth.loggedIn, (req, res) => {
    res.render('about',  { loggedIn: req.loggedIn });
});

router.get('/register', auth.loggedIn, (req, res) => {
    res.render('register',  { loggedIn: req.loggedIn });
});

router.get('/signup', auth.loggedIn, (req, res) => {
    res.render('signup',  { loggedIn: req.loggedIn });
});

router.get('/login', auth.loggedIn, (req, res) => {
    res.render('login',  { loggedIn: req.loggedIn });
});

router.get('/login', auth.guestOnly, (req, res) => {
    res.render('login');
});

router.get('/signup', auth.guestOnly, (req, res) => {
    res.render('signup');
});

/* This route isn't needed (unless it is) so its commented out but feel free to uncomment
router.get('/home', auth.loggedIn, (req, res) => {
    res.render('index', { loggedIn: req.loggedIn });
});
*/

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/register', auth.userOnly, (req, res) => {
    res.render('register');
});

router.get('/logout', (req, res) => {
    res.render('logout');
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

/* ------------------------ */
/* POST REQUESTS */
/* ------------------------ */

router.post('/login', validator.filledOut(['email', 'password']), async (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await validator.accountCredentials(res, User, email, password);

    if (!user) {
        return;
    }

    const uuidv4 = user.uuid;

    cookies.create(res, { uuidv4 }, constants.UUID_COOKIE);

    res.status(201).json('');
});

router.post('/signup', validator.filledOut(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    
    if (!validator.name(res, firstName) || !validator.name(res, lastName) || !validator.email(res, email) || !validator.password(res, password)) {
        return;
    }

    if (! await validator.unique(res, User, 'email', email)) {
        return;
    }

    const uuidv4 = await uuid.getAndValidateUUIDv4(User);

    let newUser;
    try {
        newUser = new User({
            firstName,
            lastName,
            email,
            password: hash(password),
            uuid: uuidv4,
        });
    } catch (err) {
        console.log(err);
        res.status(500).end();
        return;
    }
    try {
        await newUser.save();
    } catch (err) {
        res.status(500).end();
        return;
    }

    cookies.create(res, { uuidv4 }, constants.UUID_COOKIE);

    res.status(201).json('');
});

router.post('/logout', async (req, res) => {
    res.clearCookie(constants.UUID_COOKIE);

    res.status(201).json('');
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