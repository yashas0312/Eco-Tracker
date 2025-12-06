// Express server bootstrap
// TODO: wire routes, auth middleware, and error handling

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to DB only when a MONGO_URI is provided. This avoids startup failures
// on machines without MongoDB during early development.
if (process.env.MONGO_URI) {
	try {
		connectDB();
	} catch (err) {
		console.error('DB connect call failed:', err);
	}
} else {
	console.log('MONGO_URI not set — skipping DB connection (set MONGO_URI to enable DB)');
}

// API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
