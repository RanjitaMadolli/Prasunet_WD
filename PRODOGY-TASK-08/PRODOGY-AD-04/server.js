const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
