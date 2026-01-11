// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());             // allow frontend requests
app.use(express.json());     // parse JSON bodies

// ------------- Connect to MongoDB -------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotracke';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connect error:', err);
    process.exit(1);
  });

// ------------- Routes -------------
app.use('/api', require('./routes/api')); // mount main API routes

// ------------- Start Server -------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
