import mysql from "mysql2";

const CON_DATA = {
    host: "localhost",
    user: "root",
    password: "toor"
}

const con = mysql.createConnection(CON_DATA);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

export default {
    con
}
