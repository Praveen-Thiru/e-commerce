import UserLoginService from '../../src/services/login.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { generateAccessToken } from '../../src/security/auth.js';
import bcrypt from 'bcryptjs';

jest.mock('../../src/common/common.js');
jest.mock('../../src/security/auth.js');
jest.mock('bcryptjs');
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('UserLoginService', () => {
  let userLoginService;
  let mockUserConnection;

  beforeEach(() => {
    mockUserConnection = {
      get: jest.fn(),
    };
    userLoginService = new UserLoginService(mockUserConnection);
  });

  it('should return unauthorized when user does not exist', async () => {
    const req = {
      body: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    };

    mockUserConnection.get.mockResolvedValue(null);

    const result = await userLoginService.login(req);

    expect(mockUserConnection.get).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    expect(sendResponse).toHaveBeenCalledWith(CODES.UNAUTHORIZED, 'Invalid email');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should return unauthorized when password is incorrect', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'wrongpassword',
      },
    };

    const mockUser = {
      name: 'Test User',
      email: 'user@example.com',
      password: 'hashedPassword',
    };

    mockUserConnection.get.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const result = await userLoginService.login(req);

    expect(mockUserConnection.get).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    expect(sendResponse).toHaveBeenCalledWith(CODES.UNAUTHORIZED, 'Invalid password');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should return OK with token when login is successful', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'correctpassword',
      },
    };

    const mockUser = {
      name: 'Test User',
      email: 'user@example.com',
      password: 'hashedPassword',
    };

    const mockToken = 'mockAccessToken';

    mockUserConnection.get.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateAccessToken.mockResolvedValue(mockToken);

    const result = await userLoginService.login(req);

    expect(mockUserConnection.get).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashedPassword');
    expect(generateAccessToken).toHaveBeenCalledWith({
      username: 'Test User',
      email: 'user@example.com',
    });
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'User logged in successfully', {
      token: mockToken,
      name: mockUser.name
    });
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should handle errors and return internal server error', async () => {
    const req = {
      body: {
        email: 'user@example.com',
        password: 'password123',
      },
    };

    mockUserConnection.get.mockRejectedValue(new Error('Database error'));

    const result = await userLoginService.login(req);

    expect(sendResponse).toHaveBeenCalledWith(CODES.INTERNAL_SERVER_ERROR, 'Error in login API Call');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });
});