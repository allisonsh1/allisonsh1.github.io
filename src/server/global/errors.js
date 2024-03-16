//!! Right now the error system is complete trash,
//!! each error is custom defined instead of just
//!! having classes with constructors which would make
//!! things SO MUCH EASIER especially since errors are
//!! client side and really just need a code and a message,
//!! they don't need to know that it is in fact an
//!! 'UndefinedFormInfoError' They just need to know that
//!! not all the required fields have been filled out. Also
//!! the way errors are sent back to the client is kind of awful,
//!! since sometimes it is handled directly through a get/post
//!! request route, but other times the error is handled through
//!! their middleware which is like I guess fine sometimes but
//!! other times it just overcomplicates things when it really
//!! doesn't need to be overcomplicated because then like other
//!! times the middleware returns the error so it just becomes
//!! completely inconsist, need to pick one or the other

//!! UPDATE:
//!! THE SYSTEM IS A LOT BETTER NOW, MIGHT NEED A RE-WORK LATER
//!! BUT LIKE RIGHT NOW I THINK IT IS OKAY

/**
 * Contains project-defined errors
 */

class Error {
    static code = 500;
    constructor(message) {
        this.message = message;
    }
}

class PermissionError extends Error {
    static code = 403;
    constructor(message) {
        super(message);
    }
}

class AuthenticationError extends Error {
    static code = 401;
    constructor(message) {
        super(message);
    }
}

class UndefinedError extends Error {
    static code = 400;
    constructor(message) {
        super(message);
    }
}

class RuleViolationError extends Error {
    static code = 400;
    constructor(message) {
        super(message);
    }
}

module.exports = {
    Error,
    PermissionError,
    AuthenticationError,
    UndefinedError,
    RuleViolationError,
}