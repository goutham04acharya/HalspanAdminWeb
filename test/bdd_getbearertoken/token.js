/* eslint-disable no-undef */
async function getToken () {
    const keys = Object.keys(await driver.executeScript('return window.localStorage'))
    let token

    for (key1 of keys) {
        if (key1.includes('idToken')) {
            token = await driver.executeScript(`return window.localStorage.getItem('${key1}')`)
        }
    }

    const axiosOptions = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    return axiosOptions
}
module.exports = {
    getToken
}
