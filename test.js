const ScriptRunner = require("./ScriptRunner").ScriptRunner;
const runner = new ScriptRunner({
    host: '127.0.0.1',
    port: 3306,
    user: 'test',
    password: 'test',
    db: 'test'
});

runner.run('./script.sql').then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error.message);
});