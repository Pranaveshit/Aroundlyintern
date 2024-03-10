const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken')

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/employee'); 

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.redirect('/login');
            } else {
                req.user = decoded;
                next();
            }
        });
    }
};

app.get('/home', verifyUser, (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/dashboard');
    } else {
        res.json("Successy");
    }
});

app.get('/dashboard', verifyUser, (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.redirect('/home');
    }
}, (req, res) => {
    res.json("Success");
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ name, email, password: hash })
                .then(user => res.json("Success"))
                .catch(err => res.status(500).json({ error: "Failed to create user" }));
        })
        .catch(err => res.status(500).json({ error: "Failed to hash password" }));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email, role: user.role },
                            "jwt-secret-key", { expiresIn: '1d' });
                        res.cookie('token', token)
                        return res.json({ Status: "Success", role: user.role })

                    } else {
                        return res.json("The password in incorrect")
                    }

                })

            } else {
                return res.json("No record Existed")
            }
        })
})

app.listen(3001, () => {
    console.log("server is running");
});
