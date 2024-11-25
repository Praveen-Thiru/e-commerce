import getByCategoryService from '../../src/services/productService/getByCategory.js'; // Adjust the path accordingly
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js'); // Mock the sendResponse function
jest.mock('../../src/logger/logger.js'); // Mock the logger

describe('getByCategoryService', () => {
    let productModel;
    let service;

    beforeEach(() => {
        productModel = {
            scan: jest.fn()
        };
        service = new getByCategoryService(productModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return products for a valid category', async () => {
        const mockProducts = [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }];
        
        // Mocking the method chain correctly
        const scanMock = {
            eq: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockProducts)
            })
        };

        productModel.scan.mockReturnValue(scanMock);

        const req = { params: { category: 'Category A' } };
        const response = await service.getByCategory(req);

        expect(productModel.scan).toHaveBeenCalledWith('category');
        expect(scanMock.eq).toHaveBeenCalledWith('Category A');
        expect(response).toEqual(sendResponse(CODES.OK, mockProducts));
    });

    test('should return NOT_FOUND if no products are available for the category', async () => {
        const scanMock = {
            eq: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([])
            })
        };

        productModel.scan.mockReturnValue(scanMock);

        const req = { params: { category: 'Category A' } };
        const response = await service.getByCategory(req);

        expect(productModel.scan).toHaveBeenCalledWith('category');
        expect(scanMock.eq).toHaveBeenCalledWith('Category A');
        expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'No Products Available This Category'));
    });

    test('should handle internal server errors gracefully', async () => {
        const scanMock = {
            eq: jest.fn().mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error'))
            })
        };

        productModel.scan.mockReturnValue(scanMock);

        const req = { params: { category: 'Category A' } };
        const response = await service.getByCategory(req);

        expect(productModel.scan).toHaveBeenCalledWith('category');
        expect(scanMock.eq).toHaveBeenCalledWith('Category A');
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in Get All API'));
        expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API'));
    });
});
