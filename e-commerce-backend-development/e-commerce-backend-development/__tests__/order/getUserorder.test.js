import getUserOrderService from '../../src/services/orderService/getUserOrders.js'; // Import the service to test
import { sendResponse } from '../../src/common/common.js'; // Import the response utility
import { CODES } from '../../src/common/response-code.js'; // Import response codes
import { logger } from '../../src/logger/logger.js';

// Mocking dependencies
jest.mock('../../src/common/common.js'); // Mock the sendResponse function
jest.mock('../../src/logger/logger.js'); // Mock the logger

describe('getUserOrderService', () => {
    let orderModel;
    let service;

    beforeEach(() => {
        orderModel = {
            scan: jest.fn()
        };
        service = new getUserOrderService(orderModel);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return orders for a valid user email', async () => {
        const mockOrders = [{ id: 1, item: 'Item 1' }, { id: 2, item: 'Item 2' }];
        orderModel.scan.mockReturnValueOnce({
            eq: jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce(mockOrders)
            })
        });

        const req = { params: { email: 'user@example.com' } };
        const response = await service.getUserOrder(req);

        expect(orderModel.scan).toHaveBeenCalledWith('userEmail');
        expect(response).toEqual(sendResponse(CODES.OK, mockOrders));
    });

    test('should return NOT_FOUND if no orders are available for the user', async () => {
        orderModel.scan.mockReturnValueOnce({
            eq: jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockResolvedValueOnce([])
            })
        });

        const req = { params: { email: 'user@example.com' } };
        const response = await service.getUserOrder(req);

        expect(orderModel.scan).toHaveBeenCalledWith('userEmail');
        expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'No Orders Available For This User'));
    });

    test('should return INTERNAL_SERVER_ERROR if there is an error', async () => {
        orderModel.scan.mockReturnValueOnce({
            eq: jest.fn().mockReturnValueOnce({
                exec: jest.fn().mockRejectedValueOnce(new Error('Database error'))
            })
        });

        const req = { params: { email: 'user@example.com' } };
        const response = await service.getUserOrder(req);

        expect(orderModel.scan).toHaveBeenCalledWith('userEmail');
        expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get Uder Order  API'));
    });
});