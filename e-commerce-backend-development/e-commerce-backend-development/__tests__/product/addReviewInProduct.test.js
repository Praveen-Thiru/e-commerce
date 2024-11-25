import AddProductReviewService from '../../src/services/productService/addReview.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

// Mock the logger
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AddProductReviewService', () => {
  let productModelMock;
  let addProductReviewService;

  beforeEach(() => {
    productModelMock = {
      get: jest.fn(),
      update: jest.fn(),
    };
    addProductReviewService = new AddProductReviewService(productModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add a review successfully', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockResolvedValue({ review: [] });
    productModelMock.update.mockResolvedValue({ review: ['review-1'] });

    const response = await addProductReviewService.addProductReview(req);

    expect(response).toEqual(sendResponse(CODES.OK, { reviews: ['review-1'] }));
    expect(productModelMock.get).toHaveBeenCalledWith('123');
    expect(productModelMock.update).toHaveBeenCalledWith(
      { productId: '123' },
      { $ADD: { review: ['review-1'] } },
      { returnValues: 'UPDATED_NEW' }
    );
  });

  test('should return BAD_REQUEST if productId or reviewId is missing', async () => {
    const req = { body: {} };

    const response = await addProductReviewService.addProductReview(req);

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

    const response = await addProductReviewService.addProductReview(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Product not found'));
  });

  test('should return BAD_REQUEST if the product already has 10 reviews', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockResolvedValue({ review: new Array(10).fill('existing-review') });

    const response = await addProductReviewService.addProductReview(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Already have 10 reviews'));
  });

  test('should return INTERNAL_SERVER_ERROR on unexpected errors', async () => {
    const req = {
      body: {
        productId: '123',
        reviewId: 'review-1',
      },
    };

    productModelMock.get.mockRejectedValue(new Error('Database error'));

    const response = await addProductReviewService.addProductReview(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addProductReview API'));
  });
});
