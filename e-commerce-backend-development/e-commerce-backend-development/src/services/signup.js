import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';
import { generateAccessToken } from '../security/auth.js';
import bcrypt from 'bcryptjs';

export default class UserSignupService {
  #userConnection;

  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  signup = async (req) => {
    try {
      logger.info(req.body);
      logger.info('Checking whether email is already in database');
      const email = req.body.email.toLowerCase();
      

      // Check if email already exists
      let userExists = await this.#userConnection.get({ email });
      if (userExists) {
        return sendResponse(CODES.BAD_REQUEST, 'Email already exists. Please use a different email.');
      }

      // Hash password function
      const hashPassword = async (password) => {
        try {
          const salt = await bcrypt.genSalt(10);
          return await bcrypt.hash(password, salt);
        } catch (error) {
          throw new Error('Error hashing password: ' + error.message);
        }
      };

      // Hash the password from request body
      const hashedPassword = await hashPassword(req.body.password);
      logger.info('Hashed password:', hashedPassword);

      // Create new user instance and save to database
      let newUser = await new this.#userConnection({
        mobile: req.body.mobile,
        name: req.body.name,
        password: hashedPassword, // Store hashed password
        address: req.body.address,
        email: email,
        role: req.body.role
      }).save();

      if (newUser) {
        // Generate access token for the user
        const token = await generateAccessToken({
          username: newUser.name,
          email: newUser.email,
          role: newUser.role
        });

        return sendResponse(CODES.OK, 'User signed up successfully', { token });
      }
    } catch (error) {
      logger.error(error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in signup');
    }
  };
}
