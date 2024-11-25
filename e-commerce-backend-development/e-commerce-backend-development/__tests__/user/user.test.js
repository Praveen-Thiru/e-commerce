import request from 'supertest';
import express from 'express';
import { router } from '../../src/routes/routes.js'; 
import cors from 'cors';

// // Initialize the Express app
const app = express();
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use('/', router);
app.get('*', (req, res) => {
  res.send(200,'Welcome');
});


// // Define your test suite
describe('GET /', () => {
  it('should return 200 and welcome message', async () => {
    const response = await request(app).get('/'); // Make sure '/' is correct
    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome');
  });
});

describe('POST user/login', () => {
  it('should return 200 and a success message with valid credentials', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'mukilankumar003@gmail.com', // valid username
        password: '11111', //  valid password
      })
      .expect('Content-Type', /json/); // Expect JSON response
      global.token = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in successfully'); // Adjust based on your response
    expect(response.body.token).toBeDefined(); // Ensure the token is present

  });

  it('should return 401 with invalid credentials', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'mukilankumar003@gmail.com', // valid username
        password: '12345', //  Invalid password
      })
      .expect('Content-Type', /json/); // Expect JSON response

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password'); // Adjust based on your response
  });



  it('should return 401 with invalid credentials', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: '1@gmail.com', // Invalid username
        password: '123456', //  Invalid password
      })
      .expect('Content-Type', /json/); // Expect JSON response

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email'); // Adjust based on your response
  });
});


