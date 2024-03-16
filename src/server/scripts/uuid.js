const { v4 } = require('uuid');

/**
 * Creates a unique UUID different from all others currently in
 * the database
 * @param {Schema} model The model to search
 * @returns The unique UUID
 */
async function getAndValidateUUIDv4(model) {
    let uuidv4 = v4();

    // While the generated uuid already exists, regenerate
    while (await model.findOne({ uuid: uuidv4 })) {
        uuidv4 = v4();
    }

    return uuidv4;
}

module.exports = {
    getAndValidateUUIDv4: getAndValidateUUIDv4,
};