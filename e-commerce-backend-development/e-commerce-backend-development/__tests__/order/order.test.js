import PostOrderService from '../../src/services/orderService/addOrder.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('PostOrderService', () => {
  let service;
  let mockOrderModel;
  let mockProductModel;

  beforeEach(() => {
    mockOrderModel = {
      create: jest.fn(),
    };
    mockProductModel = {
      get: jest.fn(),
      update: jest.fn(),
    };
    service = new PostOrderService(mockOrderModel, mockProductModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add an order successfully', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com', username: 'User Name' },
        products: [{ productId: '12345', quantity: 2 }],
        status: 'Pending',
        address: '123 Main St',
        deliveryFrom: 'Warehouse',
        totalPrice: 180,
        deliveryTo: 'User',
        deliveryDate: '2023-10-01',
      },
    };
  
    const mockProduct = {
      productId: '12345',
      price: 100,
      quantity: 10,
      discount: 10,
      productName: 'Product Name',
      imageUrl: 'http://example.com/image.jpg',
    };
  
    const orderResponse = { orderId: 'order123' };
  
    mockProductModel.get.mockResolvedValueOnce(mockProduct);
    mockOrderModel.create.mockResolvedValueOnce(orderResponse);
  
    const response = await service.addOrder(req);
  
    const expectedTotalPrice = 180; // Calculate this based on product price and discount
    expect(mockProductModel.get).toHaveBeenCalledWith({ productId: '12345' });
    expect(mockProductModel.update).toHaveBeenCalledWith({ productId: '12345' }, { quantity: 8 }); // 10 - 2
    expect(mockOrderModel.create).toHaveBeenCalledWith(expect.objectContaining({
      userEmail: 'user@example.com',
      userName: 'User Name',
      products: expect.any(Array),
      totalPrice: expectedTotalPrice, // Match the expected totalPrice
      status: 'Pending',
      address: '123 Main St',
      deliveryFrom: 'Warehouse',
      deliveryTo: 'User',
      deliveryDate: '2023-10-01',
    }));
    expect(response).toEqual(sendResponse(CODES.OK, 'Order added successfully', { orderId: 'order123' }));
  });

  test('should return bad request for invalid product ID', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com', username: 'User Name' },
        products: [{ productId: 'invalid', quantity: 1 }],
        status: 'Pending',
      },
    };

    mockProductModel.get.mockResolvedValueOnce(null);

    const response = await service.addOrder(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Invalid product ID invalid'));
  });

  test('should return bad request for insufficient quantity', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com', username: 'User Name' },
        products: [{ productId: '12345', quantity: 20 }],
        status: 'Pending',
      },
    };

    const mockProduct = {
      productId: '12345',
      price: 100,
      quantity: 10,
      discount: 0,
    };

    mockProductModel.get.mockResolvedValueOnce(mockProduct);

    const response = await service.addOrder(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Insufficient quantity for product 12345'));
  });

  test('should handle errors properly', async () => {
    const req = {
      body: {
        user: { email: 'user@example.com', username: 'User Name' },
        products: [{ productId: '12345', quantity: 1 }],
        status: 'Pending',
      },
    };

    const mockProduct = {
      productId: '12345',
      price: 100,
      quantity: 10,
      discount: 0,
    };

    mockProductModel.get.mockResolvedValueOnce(mockProduct);
    mockOrderModel.create.mockRejectedValueOnce(new Error('Database error'));

    const response = await service.addOrder(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in adding order'));
    expect(logger.error).toHaveBeenCalledWith('Error in adding order:', expect.any(Error));
  });
});
