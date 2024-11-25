import GetProductReviewService from '../../src/services/getreviewByProduct.js'; // Adjust the import path as needed
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/common/response-code.js');
jest.mock('../../src/logger/logger.js');

describe('GetProductReviewService', () => {
    let reviewModelMock;
    let getProductReviewService;
  
    beforeEach(() => {
      reviewModelMock = {
        scan: jest.fn(),
        eq: jest.fn(),
        exec: jest.fn(),
      };
      getProductReviewService = new GetProductReviewService(reviewModelMock);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getReviewByProduct', () => {
      it('should return not found if no reviews are available for the product', async () => {
        const req = { params: { productId: '12345' } };
        reviewModelMock.scan.mockReturnValue(reviewModelMock); // Return the mock itself
        reviewModelMock.eq.mockReturnValue(reviewModelMock); // Return the mock itself
        reviewModelMock.exec.mockResolvedValue([]);
  
        const response = await getProductReviewService.getReviewByProduct(req);
        expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'No Reviews Available For This Product'));
      });
  
      it('should return reviews successfully', async () => {
        const req = { params: { productId: '12345' } };
        const mockReviewList = [
          { id: 1, productId: '12345', review: 'Great product!' },
          { id: 2, productId: '12345', review: 'Not bad!' },
        ];
        reviewModelMock.scan.mockReturnValue(reviewModelMock);
        reviewModelMock.eq.mockReturnValue(reviewModelMock);
        reviewModelMock.exec.mockResolvedValue(mockReviewList);
  
        const response = await getProductReviewService.getReviewByProduct(req);
        expect(response).toEqual(sendResponse(CODES.OK, mockReviewList));
      });
  
      it('should handle errors and return internal server error', async () => {
        const req = { params: { productId: '12345' } };
        reviewModelMock.scan.mockReturnValue(reviewModelMock);
        reviewModelMock.eq.mockReturnValue(reviewModelMock);
        reviewModelMock.exec.mockRejectedValue(new Error('Database error'));
  
        const response = await getProductReviewService.getReviewByProduct(req);
        expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API'));
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in Get All API:'));
      });
    });
  });
