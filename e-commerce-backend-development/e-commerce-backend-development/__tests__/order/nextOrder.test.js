import GetNextOrderServices from '../../src/services/orderService/getNextOrders.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('GetNextOrderServices', () => {
  let service;
  let mockModel;

  beforeEach(() => {
    mockModel = {
      scan: jest.fn(),
    };
    service = new GetNextOrderServices(mockModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve next orders successfully', async () => {
    const req = {}; // Assuming no specific body is required for this endpoint

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    const ordersList = [
      { orderId: '1', deliveryDate: tomorrowISO, deliveryTo: '2023-10-15' },
      { orderId: '2', deliveryDate: '2023-10-10', deliveryTo: '2023-10-11' },
      { orderId: '3', deliveryDate: '2023-10-05', deliveryTo: tomorrowISO },
      { orderId: '4', deliveryDate: '2023-10-01', deliveryTo: '2023-09-30' },
    ];

    mockModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(ordersList),
    });

    const response = await service.getNextOrders(req);

    expect(mockModel.scan).toHaveBeenCalled();
    expect(response).toEqual(sendResponse(CODES.OK, [
      { orderId: '1', deliveryDate: tomorrowISO, deliveryTo: '2023-10-15' },
      { orderId: '3', deliveryDate: '2023-10-05', deliveryTo: tomorrowISO },
    ]));
    expect(logger.info).toHaveBeenCalledWith('Inside getNextOrders method');
  });

  test('should return empty list if no orders match', async () => {
    const req = {};

    const ordersList = [
      { orderId: '1', deliveryDate: '2023-09-20', deliveryTo: '2023-09-21' },
      { orderId: '2', deliveryDate: '2023-09-15', deliveryTo: '2023-09-16' },
    ];

    mockModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(ordersList),
    });

    const response = await service.getNextOrders(req);

    expect(response).toEqual(sendResponse(CODES.OK, []));
  });

  test('should handle errors properly', async () => {
    const req = {};
    const errorMessage = 'Database error';

    mockModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    const response = await service.getNextOrders(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get next order API'));
    expect(logger.error).toHaveBeenCalledWith(`Error in Get next order API: ${errorMessage}`);
  });
});
