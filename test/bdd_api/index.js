const { faker } = require('@faker-js/faker');
const axios = require('axios');
const { getToken } = require('../bdd_getbearertoken/token');
const { data } = require('autoprefixer');

async function createQuestionnaire(payload) {
    let API_HEADERS = await getToken()
    try{
        for(i = 0; i <= 15; i++){
            const response = await axios.post(`${process.env.VITE_DOMAIN_NAME}/v1/questionnaries`, payload, { 
                headers: API_HEADERS
            })
            return response
        }
    }catch(err){
        console.log('err', err)
    }
}

module.exports = {
    createQuestionnaire,
}
