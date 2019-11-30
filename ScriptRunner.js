const mysql = require("mysql");
const fs = require("fs");
const { Client } = require("pg");

class ScriptRunner {
    constructor(info) {
        for (let key in info) {
            this[key] = info[key];
        }
        if (this.driver === 'postgres') {
            this.conn = new Client({
                user: info['user'],
                host: info['host'],
                database: info['database'],
                port: info['port'],
                password: info['password']
            });
        }
        else {
            this.conn = mysql.createConnection({
                host: info['host'],
                user: info['user'],
                password: info['password'],
                db: info['db'],
            });
        }
        this.conn.connect();
    }

    async run(sqlFile) {
        let contentOfFile = "";

        if (!sqlFile.endsWith("sql")) {
            return Promise.reject("Invalid extension");
        }
        if (fs.existsSync(sqlFile) && fs.statSync(sqlFile).isFile()) {
            contentOfFile = fs.readFileSync(sqlFile, 'utf8');
        }
        if (contentOfFile.length == 0) {
            return Promise.reject('Invalid file');
        }
        const tab = contentOfFile.split(";").filter(line => {
            return (line.trim().length > 0)
        }).map(line => line.trim()).map(line => line.replace(/[\n]/g, ""));
        return new Promise((resolve, reject) => {
            tab.forEach(line => {
                if (this.driver === "postgres") {
                    this.conn.query(line, (err, res) => {
                        if (err){
                            reject(err);
                        }
                        else {
                            resolve (res);
                        }
                    });
                }
                else {
                    this.conn.query(line, (err, result, fields) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    }
}

module.exports = { ScriptRunner };