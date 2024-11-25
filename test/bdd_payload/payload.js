/* eslint-disable max-len */
const { faker } = require('@faker-js/faker');

async function create_questionnaire_payload() {
    let publicName = `bddtest${faker.string.alphanumeric(8)}`; // Use random.alphaNumeric
    global.questionPublicName = publicName;
    return {
        // "public_name" : publicName,
        // "internal_name": "CustSatSurvey",
        // "description" : "A survey to measure customer satisfaction levels.",
        // "asset_type" : "Door",
        // "is_adhoc": false,
        // "language" : "UK-English"

        "public_name": publicName,
        "internal_name": "Minerva Levy",
        "description": "Pariatur Error quia fugiat officia hic sunt quibusdam culpa perferendis a ipsam mollitia minus in consequuntur eum autem dolor",
        "asset_type": "Fire door",
        "language": "UK- English",
        "is_adhoc": "No"

    };
}

async function lookup_dataset_payload() {
    let name = `lookup${faker.string.alphanumeric(5)}`;
    return {
        "name" : name,
        "choices": [{"value":"India"}, {"value":"China"}, {"value":"Iran"}, {"value":"United states"}, {"value":"Russia"}, {"value":"United Kingdom"}]
    };
}

module.exports = {
    create_questionnaire_payload,
    lookup_dataset_payload,
}
