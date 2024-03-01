const crypto = require('crypto');

const hashSecret = crypto.createHash('sha256').update(process.env.SESSION_SECRET).digest();
const algorithm = 'aes-256-ctr';

/**
 * Encrypts the given text
 * @param {string} text The text to encrypt
 * @returns The encrypted version of the text
 */
function encrypt(text) {
    // Create random initialization vector so one text is never the same
    const iv = crypto.randomBytes(16);

    // Create a cipher
    const cipher = crypto.createCipheriv(algorithm, hashSecret, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the encrypted text + the iv
    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts the given encrypted text
 * @param {string} text The text to decrypt
 * @returns The decrypted text
 */
function decrypt(text) {
    // Split the encrypted text into the iv and text
    const textParts = text.split(':');
    // Get the iv
    const iv = Buffer.from(textParts.shift(), 'hex');

    // Join the texts back together
    const encryptedText = textParts.join(':');

    // Create the decipher
    const decipher = crypto.createDecipheriv(algorithm, hashSecret, iv);

    // Decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Hashes the given text
 * @param {string} text The text to hash
 * @returns The hashed text
 */
const hash = (text) => crypto.createHash('sha256').update(text).digest();

module.exports = {
    encrypt,
    decrypt,
    hash,
}