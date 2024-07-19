module.exports = async function(context, commands) {
    const baseUrl = 'http://localhost:5174';
    const urls = [`${baseUrl}/`];

    for (let url of urls) {
        try {
            // Start measuring the performance for the URL
            await commands.measure.start(url);

            // Clear the browser cache after measuring
            await commands.cache.clear();

            // Navigate to a blank page to reset the state before the next measurement
            await commands.navigate('about:blank');
        } catch (error) {
            console.error(`Error while processing URL ${url}:`, error);
        }
    }
};
