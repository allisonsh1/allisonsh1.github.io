const { hash } = require('./crypter');
const { UndefinedError, RuleViolationError, AuthenticationError } = require('../global/errors');

/**
 * Verifies that all required fields are filled out for a given form 
 * @param {Array} requiredFields All required fields for a form (by ID)
 * @returns Middleware for determining if the fields are filled out
 */
function filledOut(requiredFields) {
    return function(req, res, next) {
        // The form should be embedded in the body of the request
        const form = req.body;

        // Check all required fields and make sure it isn't null, undefined, etc.
        for (const field of requiredFields) {
            // If it doesn't exist in the form object or it is white space, throw an error and return out
            if (!form[field] || /^\s*$/.test(form[field])) {
                res.status(UndefinedError.code).json(new UndefinedError('Not all required fields have been filled out'));
                return;
            }
        }

        // If all required fields are filled out
        next();
    }
}

/**
 * Determines whether or not the given query is unique
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {User} User The user database to search
 * @param {string} query The query to check for
 * @param {string} value The value to cross-reference in the database
 * @returns If the email is unique or not
 */
async function unique(res, User, query, value) {
    const queryParameters = {};
    queryParameters[query] = value;

    const user = await User.findOne(queryParameters);

    if (user) {
        res.status(RuleViolationError.code).json(new RuleViolationError(`An account with that ${query} already exists`));
    }

    return !user;
}

/**
 * Determines if the given name is valid based on name requirements
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {string} name The name to check
 * @returns Whether or not the given name is valid
 */
function name(res, name) {
    const validName = !/^.{31,}$|^.{0,2}$|(?:[!@#$%^&*()\-=+\\|/<,>;:'"`~\n\t ])|[_\.]$/.test(name);
    if (!validName) {
        res.status(RuleViolationError.code).json(new RuleViolationError('Please enter a valid name'));
    }

    return validName;
}

/**
 * Determines if the given email is valid based on email requirements
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {string} email The email to check
 * @returns Whether or not the given email is valid
 */
function email(res, email) {
    const validEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z0-9]{1,}\b/.test(email);
    if (!validEmail) {
        res.status(RuleViolationError.code).json(new RuleViolationError('Please enter a valid email'));
    }
    
    return validEmail;
}

/**
 * Determines if the given password is valid based on password requirements
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {string} password The password to check
 * @returns Whether or not the given password is valid
 */
function password(res, password) {
    const validPassword = !/^.{0,7}$|[\s]/.test(password);
    if (!validPassword) {
        res.status(RuleViolationError.code).json(new RuleViolationError('Please enter a valid password'));
    }

    return validPassword;
}

/**
 * Verifies that the given credentials for an account are valid
 * @param {Response<any, Record<string, any>, number>} res The response to the client
 * @param {User} User The user database to search
 * @param {string} email The email to look for
 * @param {string} password The password to look for
 * @returns The user if the credentials are valid, otherwise undefined
 */
async function accountCredentials(res, User, email, password) {
    // Find user credentials with given email and password
    let users;
    try {
        users = await User.find({ email: email, password: hash(password) });
    } catch (err) {
        res.status(500).end();
        return undefined;
    }

    // If length is 1, the credentials are valid
    if (users.length == 1) {
        return users[0];
    }

    // Otherwise the credentials are invalid, thus throw an invalid
    // user credentials error
    res.status(AuthenticationError.code).json(new AuthenticationError('Email or password is invalid!'));
    
    return undefined;
}

module.exports = {
    filledOut,
    unique,
    accountCredentials,
    email,
    password,
    name,
}