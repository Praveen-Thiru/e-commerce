import PostProductService from '../../src/services/productService/addProduct.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js'); // Mock the sendResponse function
jest.mock('../../src/logger/logger.js'); // Mock the logger

describe('PostProductService', () => {
  let productModel;
  let service;
  let productInstance;

  beforeEach(() => {
    productModel = jest.fn(); // Mock the model as a constructor function
    productInstance = { save: jest.fn() }; // Create a mock instance with a save method
    productModel.mockImplementation(() => productInstance); // Make the model return the mock instance
    service = new PostProductService(productModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add product successfully when all required fields are provided', async () => {
    const req = {
      body: {
        productName: 'Product A',
        category: 'Category A',
        quantity: 10,
        price: 99.99
      }
    };

    const response = await service.addProduct(req);

    expect(productModel).toHaveBeenCalledTimes(1);
    expect(productInstance.save).toHaveBeenCalledTimes(1);
    expect(response).toEqual(sendResponse(CODES.OK, 'Product added successfully'));
  });

  test('should return BAD_REQUEST if any required field is missing', async () => {
    const req = {
      body: {
        productName: 'Product A',
        category: 'Category A',
        quantity: 10,
        // price is missing
      }
    };

    const response = await service.addProduct(req);

    expect(productModel).not.toHaveBeenCalled();
    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'All the fields are mandatory'));
  });

  test('should handle internal server errors gracefully', async () => {
    const req = {
      body: {
        productName: 'Product A',
        category: 'Category A',
        quantity: 10,
        price: 99.99
      }
    };

    productInstance.save.mockRejectedValueOnce(new Error('Database error'));

    const response = await service.addProduct(req);

    expect(productModel).toHaveBeenCalledTimes(1);
    expect(productInstance.save).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error));
    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in post product API'));
  });
});
