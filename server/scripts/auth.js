const cookies = require('./cookies');
const { PermissionError, AuthenticationError, UndefinedError } = require('../global/errors');
const constants = require('../global/constants');

const User = require('../models/user');

/**
 * Middleware function that only allows guests (people not
 * signed in) to access a page (useful for things like login
 * signup, etc.)
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request from the client
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {Function} next The next middleware function
 */
async function loggedIn(req, res, next) {
    const token = cookies.tryGetUuidToken(req);

    if (!token.constructor.code) {
        // const user = await database.tryFindOne(User, { uuid: token });
        let user;
        try {
            user = await User.findOne({ uuid: token });
        } catch (err) {
            res.status(500).end();
            return;
        }
        req.loggedIn = user;
    }

    next();
}

/**
 * Middleware function that only allows guests (people not
 * signed in) to access a page (useful for things like login
 * signup, etc.)
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request from the client
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {Function} next The next middleware function
 */
async function guestOnly(req, res, next) {
    // Try to get the user's UUID cookie
    const token = cookies.tryGetUuidToken(req);

    // If there wasn't an error getting the token, see if the
    // token is actually linked to an account
    if (!token.constructor.code) {
        // user = await User.findOne({ uuid: token });
        // const user = await database.tryFindOne(User, { uuid: token });
        let user;
        try {
            user = await User.findOne({ uuid: token });
        } catch (err) {
            res.status(500).end();
            return;
        }

        // If user is defined, then we know the user is logged in
        // and they cannot access this page
        if (user) {
            res.redirect('/');
            res.status(PermissionError.code).end();
            return;
        }
    }

    // Call the next middleware function is authentication is successful
    next();
}

/**
 * Authenticates a user's login token (if it exists), and routes them
 * to the index page if it does not exist
 * 
 * On top of authentication, it also adds two values to the request
 * uuid: the user's uuid
 * user: the data pertaining to the user
 * This allows for easy access of common and useful information
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request from the client
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {Function} next The next middleware to proceed with
 */
async function userOnly(req, res, next) {
    // Try to get the UUID token
    const token = cookies.tryGetUuidToken(req);

    // If there was an error getting the token, redirect the
    // user to the index route
    if (token.constructor.code) {
        res.redirect('/');
        res.status(token.code).end();
        return;
    }

    // Try to get the user
    // const user = await User.findOne({ uuid: token });
    // const user = await database.tryFindOne(User, { uuid: token });
    let user;
    try {
        user = await User.findOne({ uuid: token });
    } catch (err) {
        res.status(500).end();
        return;
    }

    // If user is not defined, route to index
    if (!user) {
        res.redirect('/');
        res.status(AuthenticationError.code).end();
        return;
    }

    // If user is logged in, set req[uuid] to the token's value
    // and req[user] to the user (for easy access)
    req.uuid = token;
    req.user = user;

    next();
}

/**
 * Ensures that a user is an admin when they attempt to access a given page
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request from the client
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {Function} next The next middleware to proceed with
 */
async function adminOnly(req, res, next) {
    // This middleware depends on auth.userOnly, meaning if it
    // hasn't been invoked first this one wont work
    if (!req.uuid) {
        res.redirect('/');
        res.status(UndefinedError.code).end();
        return;
    }
    
    // User should already be assigned from the userOnly middleware
    const user = req.user;

    // If the user doesn't have good clearance, route to index
    if (user.clearance < constants.ADMIN) {
        res.redirect('/');
        res.status(PermissionError.code).end();
        return;
    }

    // Call the next middleware
    next();
}

module.exports = {
    loggedIn,
    guestOnly,
    userOnly,
    adminOnly,
}