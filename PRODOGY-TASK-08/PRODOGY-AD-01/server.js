
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/userDashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
