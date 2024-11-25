import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { router } from './src/routes/routes.js';


// Initialize the Express app
const app = express();

// Middleware setup
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json({ limit: '1mb' }));

// CORS setup to allow all origins
app.use(cors());

// Handle preflight requests
app.options('*', cors());

// Add headers to all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify a particular origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// Routes setup
app.use('/', router);
app.get('*', (req, res) => {
  res.status(200).send('Welcome');
});



// Export the serverless handler
const handler = serverless(app);
export { handler };
