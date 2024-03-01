const constants = require('../global/constants');
const { AuthenticationError } = require('../global/errors');
const jwt = require('jsonwebtoken');

/**
 * Creates a new cookie using the given response to the client
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {object} data The data to embed in the cookie
 * @param {string} cookieName The name of the cookie
 * @param {Date} expires The date the cookie should expire (if unspecified it will be 100 years in the future)
 */
function create(res, data, cookieName, expires) {
    // If expriation is not specified, set it far in the future
    if (expires === undefined) {
        expires = new Date().setFullYear(new Date().getFullYear() + 1000);
    }

    // Create the token to give to the client using jwt
    const token = jwt.sign(data, process.env.COOKIE_SECRET, { expiresIn: expires })

    // Create the secure cookie for the client
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: false, //! -----> NEEDS TO BE CHANGED TO TRUE IN PRODUCTION  <-----
        sameSite: 'strict', 
    });
}

/**
 * 
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req The request from the client
 * @returns The UUID token (if successful)
 */
function tryGetUuidToken(req) {
    // Get the token
    const token = req.cookies[constants.UUID_COOKIE];

    // If it doesn't exist, return an error
    if (!token) {
        return new AuthenticationError('User is not logged in');
        // return errors.LoginAuthenticationError;
    }

    // Attempt to decode the token, and return it if successful
    try {
        const decode = jwt.verify(token, process.env.COOKIE_SECRET);
        return decode.uuidv4;
    } catch (ex) {
        return new AuthenticationError('UUID token is invalid');
    }
}

module.exports = {
    create,
    tryGetUuidToken,
}