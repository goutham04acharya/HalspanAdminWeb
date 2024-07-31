export default function objectToQueryString(obj) {
    const keys = Object.keys(obj);
    let str = ''
    const keyValuePairs = keys.map((key, i) => {
        str += `${i === 0 ? `?` : '&'}${encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])}`;
    });
    return str
    // more code goes here
}