module.exports = async function(context, commands) {
    let a = 'http://localhost:5174'
    
    const urls = [
        `${a}/`,
    ]
    for (let url of urls) {
        // Do the stuff for each url that you need to do
        // Maybe login a user or add a cookie or something
        // Then test the URL
        await commands.measure.start(url);
        // When the test is finished, clear the browser cache
        await commands.cache.clear();
        // Navigate to a blank page so you kind of start from scratch for the next URL
        await commands.navigate('about:blank');
    }
};

