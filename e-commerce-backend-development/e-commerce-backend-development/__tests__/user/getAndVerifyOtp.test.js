import GetOtpService from '../../src/services/getOtp.js';
import { sendResponse } from '../../src/common/common.js';
import { mailObj, transporter } from '../../src/common/mail.config.js';
import { CODES } from '../../src/common/response-code.js';
import bcrypt from 'bcryptjs';

jest.mock('../../src/common/common.js');
jest.mock('../../src/common/mail.config.js');
jest.mock('bcryptjs');

describe('GetOtpService', () => {
  let getOtpService;
  let mockUserConnection;

  beforeEach(() => {
    mockUserConnection = {
      get: jest.fn(),
      scan: jest.fn(),
      update: jest.fn(),
    };
    getOtpService = new GetOtpService(mockUserConnection);
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  describe('getOtp', () => {
    it('should send OTP successfully', async () => {
      const req = { params: { email: 'test@example.com' } };
      const mockUser = {
        email: 'test@example.com',
        save: jest.fn(),
      };

      mockUserConnection.get.mockResolvedValue(mockUser);
      mailObj.mockResolvedValue({});
      transporter.sendMail.mockResolvedValue({});

      const result = await getOtpService.getOtp(req);

      expect(mockUserConnection.get).toHaveBeenCalledWith('test@example.com');
      expect(mockUser.save).toHaveBeenCalled();
      expect(transporter.sendMail).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'OTP sent');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });

    it('should return BAD_REQUEST if user not found', async () => {
      const req = { params: { email: 'nonexistent@example.com' } };

      mockUserConnection.get.mockResolvedValue(null);

      const result = await getOtpService.getOtp(req);

      expect(mockUserConnection.get).toHaveBeenCalledWith('nonexistent@example.com');
      expect(sendResponse).toHaveBeenCalledWith(CODES.BAD_REQUEST, 'User Not Found');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const req = { body: { email: 'test@example.com', otp: '123456' } };

      mockUserConnection.scan.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ email: 'test@example.com' }]),
      });

      const result = await getOtpService.verifyOtp(req);

      expect(mockUserConnection.scan).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'OTP Verified Successfully!');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });

    it('should return BAD_REQUEST if OTP is invalid or expired', async () => {
      const req = { body: { email: 'test@example.com', otp: '123456' } };

      mockUserConnection.scan.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await getOtpService.verifyOtp(req);

      expect(mockUserConnection.scan).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(CODES.BAD_REQUEST, 'Invalid OTP or OTP has expired');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const req = { body: { email: 'test@example.com', password: 'newPassword' } };

      mockUserConnection.get.mockResolvedValue({ email: 'test@example.com' });
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const result = await getOtpService.changePassword(req);

      expect(mockUserConnection.get).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 'salt');
      expect(mockUserConnection.update).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        { otp: 0, expireTime: 0, password: 'hashedPassword' }
      );
      expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'OTP Verified and New Password has been Set Successfully!');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });

    it('should return NOT_FOUND if user does not exist', async () => {
      const req = { body: { email: 'nonexistent@example.com', password: 'newPassword' } };

      mockUserConnection.get.mockResolvedValue(null);

      const result = await getOtpService.changePassword(req);

      expect(mockUserConnection.get).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(sendResponse).toHaveBeenCalledWith(CODES.NOT_FOUND, 'User not Found');
      expect(result).toBe(sendResponse.mock.results[0].value);
    });
  });
});