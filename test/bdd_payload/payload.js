/* eslint-disable max-len */
const { faker } = require('@faker-js/faker');

async function create_questionnaire_payload() {
    let publicName = `bddtest${faker.string.alphanumeric(20)}`; // Use random.alphaNumeric
    console.log(publicName);
    global.questionPublicName = publicName;
    return {
        // "public_name" : publicName,
        // "internal_name": "CustSatSurvey",
        // "description" : "A survey to measure customer satisfaction levels.",
        // "asset_type" : "Door",
        // "is_adhoc": false,
        // "language" : "UK-English"

        "public_name": publicName,
        "internal_name": "Minerva Levy 1",
        "description": "Pariatur Error quia fugiat officia hic sunt quibusdam culpa perferendis a ipsam mollitia minus in consequuntur eum autem dolor",
        "asset_type": "1",
        "language": "UK- English",
        "services_type":"FABRICATION",
        "is_adhoc": "No",
        "asset_name": "Fire door"
    };
}

async function lookup_dataset_payload() {
    let name = `lookup${faker.string.alphanumeric(5)}`;
    global.lookupName = name;
    return {
        "name" : name,
        "choices": [{"value":"India"}, {"value":"China"}, {"value":"Iran"}, {"value":"United states"}, {"value":"Russia"}, {"value":"United Kingdom"}]
    };
}

module.exports = {
    create_questionnaire_payload,
    lookup_dataset_payload,
}
