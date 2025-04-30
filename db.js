import mysql from "mysql2/promise";

const CON_DATA = {
    host: "localhost",
    user: "root",
    password: "toor",
    database: "vet_clinic"
}

const con = await mysql.createConnection(CON_DATA);

const addUser = async(user) => {
    const QUERY_STRING = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";

    return await con.query(QUERY_STRING, [user.name, user.email, user.password]);
}

const getUserByEmail = async(email) => {
    const con = await mysql.createConnection(CON_DATA);

    const QUERY_STRING = `SELECT * FROM user WHERE email = '${email}'`;

    return (await con.query(QUERY_STRING))[0][0];
}

export default {
    addUser,
    getUserByEmail
}
