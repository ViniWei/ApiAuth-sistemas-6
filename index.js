import express from "express";
import bcrypt from "bcrypt";

const PORT = 6767;
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
    console.log(data);

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

    res.status(200).send("User logged in.");
})

app.listen(PORT, () => { console.log("Listening on port:", PORT) });
