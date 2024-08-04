const { faker } = require('@faker-js/faker');

async function create_questionnaire_payload() {
    let publicName = `bddtest${faker.string.alphanumeric(5)}`; // Use random.alphaNumeric
    return {
        "public_name" : publicName,
        "internal_name": "CustSatSurvey",
        "description" : "A survey to measure customer satisfaction levels.",
        "asset_type" : "Door",
        "is_adhoc": false,
        "language" : "UK-English"
    };
}

async function lookup_dataset_payload() {
    let name = `lookup${faker.string.alphanumeric(5)}`;
    return {
        "name" : name,
        "choices": "India, China, Iran, United states, Russia, United Kingdom",
    };
}

module.exports = {
    create_questionnaire_payload,
    lookup_dataset_payload,
}
