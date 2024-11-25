import EditUserWishlistService from '../../src/services/userService/removeWishlist.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('EditUserWishlistService', () => {
  let service;
  let mockUserModel;

  beforeEach(() => {
    mockUserModel = {
      get: jest.fn(),
      update: jest.fn(),
    };
    service = new EditUserWishlistService(mockUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should remove product from the user\'s wishlist successfully', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
        productId: '12345',
      },
    };

    const mockCurrentUser = {
      email: 'user@example.com',
      wishlist: ['12345', '67890'],
    };

    mockUserModel.get.mockResolvedValueOnce(mockCurrentUser);
    mockUserModel.update.mockResolvedValueOnce({ wishlist: ['67890'] });

    const response = await service.removeProductFromWishlist(req);

    expect(mockUserModel.get).toHaveBeenCalledWith('user@example.com');
    expect(mockUserModel.update).toHaveBeenCalledWith(
      { email: 'user@example.com' },
      { wishlist: ['67890'] },
      { returnValues: 'UPDATED_NEW' }
    );
    expect(response).toEqual(sendResponse(CODES.OK, { wishlist: ['67890'] }));
    expect(logger.info).toHaveBeenCalledWith('Product removed from wishlist successfully');
  });

  test('should return bad request if email or productId is missing', async () => {
    const req = {
      body: {
        user: { email: '' }, // Missing productId
      },
    };

    const response = await service.removeProductFromWishlist(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Email and productId are required'));
  });

  test('should return not found if user does not exist', async () => {
    const req = {
      body: {
        user: { email: 'nonexistent@example.com' },
        productId: '12345',
      },
    };

    mockUserModel.get.mockResolvedValueOnce(null);

    const response = await service.removeProductFromWishlist(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'User not found'));
  });

  test('should return not found if product is not in the wishlist', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
        productId: '12345',
      },
    };

    const mockCurrentUser = {
      email: 'user@example.com',
      wishlist: ['67890'], // Product is not in the wishlist
    };

    mockUserModel.get.mockResolvedValueOnce(mockCurrentUser);

    const response = await service.removeProductFromWishlist(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Product not found in wishlist'));
  });

  test('should handle errors properly', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com' },
        productId: '12345',
      },
    };

    const errorMessage = 'Database error';
    mockUserModel.get.mockResolvedValueOnce({ email: 'user@example.com', wishlist: ['12345'] });
    mockUserModel.update.mockRejectedValueOnce(new Error(errorMessage));

    const response = await service.removeProductFromWishlist(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeProductFromWishlist API'));
    expect(logger.error).toHaveBeenCalledWith(`Error in removeProductFromWishlist API: ${errorMessage}`);
  });
});
