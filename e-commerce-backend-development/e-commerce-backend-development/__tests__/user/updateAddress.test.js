import EditUserAddressService from '../../src/services/userService/updateAddress.js'; 
import { logger } from '../../src/logger/logger.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

jest.mock('../../src/logger/logger.js');
jest.mock('../../src/common/common.js');
jest.mock('../../src/common/response-code.js');

describe('EditUserAddressService', () => {
  let userModelMock;
  let editUserAddressService;

  beforeEach(() => {
    userModelMock = {
      get: jest.fn(),
      save: jest.fn(),
    };
    editUserAddressService = new EditUserAddressService(userModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('editUserAddress', () => {
    it('should return bad request if email, addressId, or updatedAddress is missing', async () => {
      const req = { body: { user: { email: '' }, addressId: '', updatedAddress: {} } };
      const response = await editUserAddressService.editUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Email, address ID, and updated address are required'));
    });

    it('should return not found if user does not exist', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123', updatedAddress: {} } };
      userModelMock.get.mockResolvedValue(null);
      const response = await editUserAddressService.editUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'User not found'));
    });

    it('should return not found if address does not exist', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123', updatedAddress: {} } };
      const userData = { address: [] };
      userModelMock.get.mockResolvedValue(userData);
      const response = await editUserAddressService.editUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Address not found'));
    });

    it('should update the address successfully', async () => {
      const req = {
        body: {
          user: { email: 'test@example.com' },
          addressId: '123',
          updatedAddress: { street: 'New Street' },
        },
      };
      const userData = {
        address: [{ id: '123', street: 'Old Street' }],
        save: jest.fn(),
      };
      userModelMock.get.mockResolvedValue(userData);

      const response = await editUserAddressService.editUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.OK, userData));
      expect(userData.address[0].street).toBe('New Street');
      expect(userData.save).toHaveBeenCalled();
    });

    it('should handle errors and return internal server error', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123', updatedAddress: {} } };
      userModelMock.get.mockRejectedValue(new Error('Database error'));

      const response = await editUserAddressService.editUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in editUserAddress API'));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in editUserAddress API'));
    });
  });

  describe('removeUserAddress', () => {
    it('should return bad request if email or addressId is missing', async () => {
      const req = { body: { user: { email: '' }, addressId: '' } };
      const response = await editUserAddressService.removeUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Email and address ID are required'));
    });

    it('should return not found if user does not exist', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123' } };
      userModelMock.get.mockResolvedValue(null);
      const response = await editUserAddressService.removeUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'User not found'));
    });

    it('should return not found if address does not exist', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123' } };
      const userData = { address: [] };
      userModelMock.get.mockResolvedValue(userData);
      const response = await editUserAddressService.removeUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Address not found'));
    });

    it('should remove the address successfully', async () => {
      const req = {
        body: {
          user: { email: 'test@example.com' },
          addressId: '123',
        },
      };
      const userData = {
        address: [{ id: '123', street: 'Old Street' }],
        save: jest.fn(),
      };
      userModelMock.get.mockResolvedValue(userData);

      const response = await editUserAddressService.removeUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.OK, userData));
      expect(userData.address.length).toBe(0);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should handle errors and return internal server error', async () => {
      const req = { body: { user: { email: 'test@example.com' }, addressId: '123' } };
      userModelMock.get.mockRejectedValue(new Error('Database error'));

      const response = await editUserAddressService.removeUserAddress(req);
      expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeUserAddress API'));
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in removeUserAddress API'));
    });
  });
});
