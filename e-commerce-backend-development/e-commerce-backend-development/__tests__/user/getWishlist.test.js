import GetUserWishlistService from '../../src/services/userService/getWishlist.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('GetUserWishlistService', () => {
  let service;
  let mockUserModel;
  let mockProductModel;

  beforeEach(() => {
    mockUserModel = {
      get: jest.fn(),
    };
    mockProductModel = {
      get: jest.fn(),
    };
    service = new GetUserWishlistService(mockUserModel, mockProductModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve user wishlist successfully', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
      },
    };

    const mockCurrentUser = {
      email: 'user@example.com',
      wishlist: ['12345', '67890'],
    };

    const mockProduct1 = { id: '12345', name: 'Product 1' };
    const mockProduct2 = { id: '67890', name: 'Product 2' };

    mockUserModel.get.mockResolvedValueOnce(mockCurrentUser);
    mockProductModel.get.mockResolvedValueOnce(mockProduct1);
    mockProductModel.get.mockResolvedValueOnce(mockProduct2);

    const response = await service.getUserWishlist(req);

    expect(mockUserModel.get).toHaveBeenCalledWith('user@example.com');
    expect(mockProductModel.get).toHaveBeenCalledTimes(2);
    expect(mockProductModel.get).toHaveBeenCalledWith('12345');
    expect(mockProductModel.get).toHaveBeenCalledWith('67890');
    expect(response).toEqual(sendResponse(CODES.OK, [mockProduct1, mockProduct2]));
    expect(logger.info).toHaveBeenCalledWith('Inside getUserWishlist method');
  });

  test('should return not found if user does not exist', async () => {
    const req = {
      body: {
        user: { email: 'nonexistent@example.com' },
      },
    };

    mockUserModel.get.mockResolvedValueOnce(null);

    const response = await service.getUserWishlist(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'User Not Found'));
  });

  test('should return not found if wishlist is empty', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
      },
    };

    const mockCurrentUser = {
      email: 'user@example.com',
      wishlist: [],
    };

    mockUserModel.get.mockResolvedValueOnce(mockCurrentUser);

    const response = await service.getUserWishlist(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Wishlist is empty'));
  });

  test('should handle errors properly', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
      },
    };

    const errorMessage = 'Database error';
    mockUserModel.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await service.getUserWishlist(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get User Wishlist API'));
    expect(logger.error).toHaveBeenCalledWith(`Error in Get User Wishlist API: ${errorMessage}`);
  });
});
