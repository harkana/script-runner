const mysql = require("mysql");
const fs = require("fs");

class ScriptRunner {
    constructor(info) {
        this.conn = mysql.createConnection({
            host: info['host'],
            user: info['user'],
            password: info['password'],
            db: info['db']
        });

        this.conn.connect();
    }

    run(sqlFile) {
        let contentOfFile = "";

        if (!sqlFile.endsWith("sql")){
            return Promise.reject("Invalid extension");
        }
        if (fs.existsSync(sqlFile) && fs.statSync(sqlFile).isFile()){
            contentOfFile = fs.readFileSync(sqlFile);
        }
        if (contentOfFile.length == 0){
            return Promise.reject('Invalid file');
        }
        return new Promise((resolve, reject) => {
            this.conn.query(contentOfFile, (err, result, fields) => {
                if (err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        });
    }
}

module.exports = { ScriptRunner };