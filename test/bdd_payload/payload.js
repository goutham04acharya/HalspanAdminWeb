/* eslint-disable max-len */
const { faker } = require('@faker-js/faker');

async function create_questionnaire_payload() {
    let publicName = `bddtest${faker.string.alphanumeric(5)}`; // Use random.alphaNumeric
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
        "asset_type": "Door",
        "language": "UK- English",
        "is_adhoc": "No"

    };
}

module.exports = {
    create_questionnaire_payload,
}
