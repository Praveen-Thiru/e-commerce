import RemoveProductReviewService from '../../src/services/productService/removeReview.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

// Mock the logger
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('RemoveProductReviewService', () => {
  let productModelMock;
  let removeProductReviewService;

  beforeEach(() => {
    productModelMock = {
      get: jest.fn(),
      update: jest.fn(),
    };
    removeProductReviewService = new RemoveProductReviewService(productModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should remove a review successfully', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockResolvedValue({ review: ['review-1', 'review-2'] });
    productModelMock.update.mockResolvedValue({ review: ['review-2'] });

    const response = await removeProductReviewService.removeProductReview(req);

    expect(response).toEqual(sendResponse(CODES.OK, { reviews: ['review-2'] }));
    expect(productModelMock.get).toHaveBeenCalledWith('123');
    expect(productModelMock.update).toHaveBeenCalledWith(
      { productId: '123' },
      { review: ['review-2'] },
      { returnValues: 'UPDATED_NEW' }
    );
  });

  test('should return BAD_REQUEST if productId or reviewId is missing', async () => {
    const req = { body: {} };

    const response = await removeProductReviewService.removeProductReview(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'ProductId and reviewId are required'));
  });

  test('should return NOT_FOUND if the product does not exist', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockResolvedValue(null);

    const response = await removeProductReviewService.removeProductReview(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Product not found'));
  });

  test('should return NOT_FOUND if the review does not exist', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-3',
      },
    };

    productModelMock.get.mockResolvedValue({ review: ['review-1', 'review-2'] });

    const response = await removeProductReviewService.removeProductReview(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Review not found in product reviews'));
  });

  test('should return INTERNAL_SERVER_ERROR on unexpected errors', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockRejectedValue(new Error('Database error'));

    const response = await removeProductReviewService.removeProductReview(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeProductReview API'));
  });
});
