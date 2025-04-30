import mysql from "mysql2";

const CON_DATA = {
    host: "localhost",
    user: "root",
    password: "toor",
    database: "teste"
}

const con = mysql.createConnection(CON_DATA);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const addUser = (user) => {
    const QUERY_STRING = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;

    con.query(QUERY_STRING, [user.name, user.email, user.password], (err, results) => {
        if (err) {
            console.error("Error inserting user:", err);
        } else {
            return results;
        }
    });
}

export default {
    addUser
}
