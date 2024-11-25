import UserSignupService from '../../src/services/signup.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { generateAccessToken } from '../../src/security/auth.js';
import bcrypt from 'bcryptjs';

jest.mock('../../src/common/common.js');
jest.mock('../../src/security/auth.js');
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('bcryptjs');

describe('UserSignupService', () => {
  let userSignupService;
  let mockUserConnection;
  let mockSave;

  beforeEach(() => {
    mockSave = jest.fn();
    mockUserConnection = jest.fn(() => ({
      save: mockSave,
    }));
    mockUserConnection.get = jest.fn();
    userSignupService = new UserSignupService(mockUserConnection);
  });

  it('should sign up a new user successfully', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        mobile: '1234567890',
        name: 'Test User',
        address: '123 Test St',
        role: 'user',
      },
    };

    mockUserConnection.get.mockResolvedValue(null);
    mockSave.mockResolvedValue({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      role: req.body.role,
    });

    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    generateAccessToken.mockResolvedValue('mockToken');

    const result = await userSignupService.signup(req);

    expect(mockUserConnection.get).toHaveBeenCalledWith({ email: req.body.email.toLowerCase() });
    expect(mockUserConnection).toHaveBeenCalledWith(expect.objectContaining({
      email: req.body.email.toLowerCase(),
      password: 'hashedPassword',
      mobile: req.body.mobile,
      name: req.body.name,
      address: req.body.address,
      role: req.body.role,
    }));
    expect(mockSave).toHaveBeenCalled();
    expect(generateAccessToken).toHaveBeenCalledWith({
      username: req.body.name,
      email: req.body.email.toLowerCase(),
      role: req.body.role,
    });
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'User signed up successfully', { token: 'mockToken' });
    expect(result).toEqual(sendResponse.mock.results[0].value);
  });

  it('should return an error if email already exists', async () => {
    const req = {
      body: {
        email: 'existing@example.com',
        password: 'password123',
      },
    };

    mockUserConnection.get.mockResolvedValue({ email: req.body.email });

    const result = await userSignupService.signup(req);

    expect(mockUserConnection.get).toHaveBeenCalledWith({ email: req.body.email.toLowerCase() });
    expect(sendResponse).toHaveBeenCalledWith(CODES.BAD_REQUEST, 'Email already exists. Please use a different email.');
    expect(result).toEqual(sendResponse.mock.results[0].value);
  });

  it('should handle errors during signup process', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };

    mockUserConnection.get.mockRejectedValue(new Error('Database error'));

    const result = await userSignupService.signup(req);

    expect(sendResponse).toHaveBeenCalledWith(CODES.INTERNAL_SERVER_ERROR, 'Error in signup');
    expect(result).toEqual(sendResponse.mock.results[0].value);
  });
});