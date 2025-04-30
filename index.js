import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NodeCache from "node-cache";

import db from "./db.js";

const cache = new NodeCache({ stdTTL: 60 * 10 })

const PORT = 6767;
const SECRET_KEY = "test_secret_key";

const BASE_PATH = "/api/users"

const app = express();

app.use(express.json());

app.post(`${BASE_PATH}/registerUser`, async(req, res) => {
    const { name, email, password } = req.body;

    let existingUser = cache.get(email);
    if (!existingUser) {
        existingUser = await db.getUserByEmail(email);
        cache.set(email, existingUser); 
    }

    if (existingUser) {
        return res.status(409).send("User email is already in use.");
    }

    const user = {
        email,
        name,
        password: await bcrypt.hash(password, 3)
    };

    try {
        await db.addUser(user);
    } catch (e) {
        res.status(500).send("Internal server error.");
    }

    res.send("success.");
});

app.post(`${BASE_PATH}/login`, async(req, res) => {
    const { email, password } = req.body;

    let user = cache.get(email);
    if (!user) {
        user = await db.getUserByEmail(email);
        cache.set(email, user); 
    }

    if (!user) {
        return res.status(400).send("Not authorized.");
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password)

    if (!isPasswordMatching) {
        res.status(400).send("Not authorized.");
    }

    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY);

    res.status(200).send(token);
})

app.get(`${BASE_PATH}/verifyToken`, (req, res) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' })
    }

    const cachedData = cache.get(token);
    if (cachedData) {
        return res.json({ message: 'Token is valid', data: cachedData });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }

        cache.set(token, decoded); 
        res.json({ message: 'Token is valid', data: decoded });
    });
})

app.listen(PORT, () => { console.log("Listening on port:", PORT) });
