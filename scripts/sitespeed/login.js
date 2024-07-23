module.exports = async function(context, commands) {
    const url = 'http://localhost:5174';

    try {
        await commands.navigate(url);
        // Add any login logic here if necessary
        return commands.wait.byPageToComplete();
    } catch (error) {
        console.error('Error during navigation:', error);
    }
};
