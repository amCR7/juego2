import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    user: "duelo",
    password: "root",
    database: "mydb",
});

export default db;
