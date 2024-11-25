import GetProductDetailsService from '../../src/services/productService/getProductDetails.js'; 
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

// Mock the logger
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('GetProductDetailsService', () => {
  let productModelMock;
  let reviewModelMock;
  let getProductDetailsService;

  beforeEach(() => {
    productModelMock = {
      get: jest.fn(),
    };
    reviewModelMock = {
      batchGet: jest.fn(),
    };
    getProductDetailsService = new GetProductDetailsService(productModelMock, reviewModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return product details successfully', async () => {
    const req = {
      params: {
        productId: '123',
      },
    };

    const mockProduct = { id: '123', name: 'Test Product', review: ['review-1', 'review-2'] };
    const mockReviews = [{ reviewId: 'review-1', content: 'Great product!' }, { reviewId: 'review-2', content: 'Not bad.' }];

    productModelMock.get.mockResolvedValue(mockProduct);
    reviewModelMock.batchGet.mockResolvedValue(mockReviews);

    const response = await getProductDetailsService.getproductDetails(req);

    expect(response).toEqual(sendResponse(CODES.OK, { product: mockProduct, review: mockReviews }));
    expect(productModelMock.get).toHaveBeenCalledWith('123');
    expect(reviewModelMock.batchGet).toHaveBeenCalledWith([{ reviewId: 'review-1' }, { reviewId: 'review-2' }]);
  });

  test('should return NOT_FOUND if product does not exist', async () => {
    const req = {
      params: {
        productId: '123',
      },
    };

    productModelMock.get.mockResolvedValue(null);

    const response = await getProductDetailsService.getproductDetails(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'No Products Available This Category'));
  });

  test('should return INTERNAL_SERVER_ERROR on unexpected errors', async () => {
    const req = {
      params: {
        productId: '123',
      },
    };

    productModelMock.get.mockRejectedValue(new Error('Database error'));

    const response = await getProductDetailsService.getproductDetails(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API'));
  });
});
