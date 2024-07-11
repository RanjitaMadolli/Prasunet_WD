
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    preferences: [String]
});
module.exports = mongoose.model('User', UserSchema);

// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name, email, password, preferences } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, preferences });
    await newUser.save();
    res.status(201).send("User registered");
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
});

router.get('/profile', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied");

    const decoded = jwt.verify(token, 'secretKey');
    const user = await User.findById(decoded.id);
    res.json(user);
});

module.exports = router;
