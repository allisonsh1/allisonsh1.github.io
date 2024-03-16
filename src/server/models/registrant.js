const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

const Registrant = mongoose.model('Registrant', schema);

module.exports = Registrant;