module.exports = async function (context, commands) {
    await commands.navigate('http://localhost:5174');
    return commands.wait.byPageToComplete();
};
