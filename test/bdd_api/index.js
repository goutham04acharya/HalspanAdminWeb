/* eslint-disable max-len */
const axios = require('axios');
const { authHeader } = require('../bdd_getbearertoken/token');

async function createQuestionnaire(payload) {
    let API_HEADERS = await authHeader()
    // console.log('auth headers', API_HEADERS)
    try{
        for(i = 0; i <= 10; i++){
            response = await axios.post(`https://${process.env.VITE_DOMAIN_NAME}/v1/questionnaires`, payload, {headers: API_HEADERS })
            console.log('public name: ', payload);
            return response
        }
    }catch(err){
        console.log('err', err)
    }
}

async function createLookupDataset(payload) {
    let API_HEADERS = await authHeader()
    // console.log('auth headers', API_HEADERS)
    try{
        for(i = 0; i <= 10; i++){
            response = await axios.post(`https://${process.env.VITE_DOMAIN_NAME}/v1/lookup-data`, payload, {headers: API_HEADERS })
            // console.log('response', response)
            return response
        }
    }catch(err){
        console.log('err', err)
    }
}

async function Questionnaire(payload) {
    let API_HEADERS = await authHeader()
    // console.log('auth headers', API_HEADERS)
    try{
        response = await axios.post(`https://${process.env.VITE_DOMAIN_NAME}/v1/questionnaires`, payload, {headers: API_HEADERS })
        // console.log('response', response)
        return response
    }catch(err){
        console.log('err', err)
    }
}


module.exports = {
    createQuestionnaire,
    Questionnaire,
    createLookupDataset,
}
