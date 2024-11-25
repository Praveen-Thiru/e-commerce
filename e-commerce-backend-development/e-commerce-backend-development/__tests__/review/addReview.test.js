import PostReviewService from '../../src/services/addReview.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('PostReviewService', () => {
  let postReviewService;
  let mockReviewModel;
  let mockProductModel;

  beforeEach(() => {
    mockReviewModel = jest.fn(() => ({
      save: jest.fn().mockResolvedValue(undefined),
    }));
    mockReviewModel.scan = jest.fn().mockReturnThis();
    mockReviewModel.eq = jest.fn().mockReturnThis();
    mockReviewModel.exec = jest.fn();

    mockProductModel = {
      get: jest.fn(),
      update: jest.fn(),
    };
    postReviewService = new PostReviewService(mockReviewModel, mockProductModel);
  });

  it('should add a review successfully', async () => {
    const req = {
      body: {
        productId: '123',
        rating: 4,
        user: { email: 'test@example.com', username: 'testuser' },
        comment: 'Great product!',
      },
    };

    mockProductModel.get.mockResolvedValue({ productId: '123', name: 'Test Product' });
    mockReviewModel.exec.mockResolvedValue([
      { rating: 4 },
      { rating: 5 },
      { rating: 4 }, // This represents the new review
    ]);

    const result = await postReviewService.addReview(req);

    expect(mockProductModel.get).toHaveBeenCalledWith('123');
    expect(mockReviewModel).toHaveBeenCalledWith({
      ...req.body,
      userEmail: 'test@example.com',
      userName: 'testuser',
    });
    expect(mockReviewModel.scan).toHaveBeenCalledWith('productId');
    expect(mockReviewModel.eq).toHaveBeenCalledWith('123');
    expect(mockReviewModel.exec).toHaveBeenCalled();
    expect(mockProductModel.update).toHaveBeenCalledWith('123', { overAllRating: 4.3 });
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'Review added successfully and product rating updated');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should return BAD_REQUEST if productId or rating is missing', async () => {
    const req = {
      body: {
        user: { email: 'test@example.com', username: 'testuser' },
        comment: 'Great product!',
      },
    };

    const result = await postReviewService.addReview(req);

    expect(sendResponse).toHaveBeenCalledWith(CODES.BAD_REQUEST, 'Missing productId and rating');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should return NOT_FOUND if product does not exist', async () => {
    const req = {
      body: {
        productId: '123',
        rating: 4,
        user: { email: 'test@example.com', username: 'testuser' },
        comment: 'Great product!',
      },
    };

    mockProductModel.get.mockResolvedValue(null);

    const result = await postReviewService.addReview(req);

    expect(mockProductModel.get).toHaveBeenCalledWith('123');
    expect(sendResponse).toHaveBeenCalledWith(CODES.NOT_FOUND, 'Product not found');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });

  it('should handle errors and return INTERNAL_SERVER_ERROR', async () => {
    const req = {
      body: {
        productId: '123',
        rating: 4,
        user: { email: 'test@example.com', username: 'testuser' },
        comment: 'Great product!',
      },
    };

    mockProductModel.get.mockRejectedValue(new Error('Database error'));

    const result = await postReviewService.addReview(req);

    expect(mockProductModel.get).toHaveBeenCalledWith('123');
    expect(logger.error).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(CODES.INTERNAL_SERVER_ERROR, 'Error in adding review');
    expect(result).toBe(sendResponse.mock.results[0].value);
  });
});