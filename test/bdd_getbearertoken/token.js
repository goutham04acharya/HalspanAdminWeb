/* eslint-disable no-undef */
require('dotenv').config();

const authHeader = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const keys = Object.keys(await driver.executeScript(`return window.localStorage`))
    let authToken;
    for(key1 of keys){
        if(key1.includes('@@user@@')){
            authToken = await driver.executeScript(`return JSON.parse(window.localStorage.getItem('${key1}'))`);
        }
    }
    const rawAuthToken = authToken.decodedToken.claims.__raw
    const API_HEADERS = {
        "Authorization": `Bearer ${rawAuthToken}`,
        "Content-Type": 'application/json',
    };
    return API_HEADERS
}
module.exports = {
    authHeader
}
