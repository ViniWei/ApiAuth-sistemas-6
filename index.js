import express from "express";
import bcrypt from "bcrypt";

const PORT = 6767;
const app = express();

app.use(express.json());

const data = [
    {
        email: "Tiago@email.com",
        password: "cu",
    }    
];

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

app.get("/login", () => {
    const { email, password } = req.body;

    const user = data.find((u) => u.email === email);

    if (!user) {
        res.status(401).send("Not authorized.");
    }
})

app.listen(PORT, () => { console.log("Listening on port:", PORT) });
