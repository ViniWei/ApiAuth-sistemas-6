import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PORT = 6767;
const SECRET_KEY = "test_secret_key";
const app = express();

app.use(express.json());


const data = [];

app.post("/registerUser", async(req, res) => {
    const { email, password } = req.body;

    const existingUser = data.find((u) => u.email === email);

    if (existingUser) {
        res.status(409).send("User email is already in use.");
    }

    const user = {
        email,
        password: await bcrypt.hash(password, 3)
    };

    data.push(user);

    res.send("success.");
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    const user = data.find((u) => u.email === email);

    if (!user) {
        res.status(400).send("Not authorized.");
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password)

    if (!isPasswordMatching) {
        res.status(400).send("Not authorized.");
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY);

    res.status(200).send(token);
})

app.get("/verifyToken", (req, res) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' })
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        res.json({ message: 'Token is valid', data: decoded });
    });
})

app.listen(PORT, () => { console.log("Listening on port:", PORT) });
