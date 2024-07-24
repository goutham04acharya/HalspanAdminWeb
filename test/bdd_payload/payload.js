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

module.exports = {
    create_questionnaire_payload,
}
