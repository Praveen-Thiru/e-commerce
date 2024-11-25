import GetTomorrowOrderServices from '../../src/services/orderService/getTomorowOrders.js'; // Adjust the import based on your file structure
import { logger } from '../../src/logger/logger.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

jest.mock('../../src/logger/logger.js');
jest.mock('../../src/common/common.js');
jest.mock('../../src/common/response-code.js');

describe('GetTomorrowOrderServices', () => {
  let mockModel;
  let service;

  beforeEach(() => {
    mockModel = {
      scan: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };
    service = new GetTomorrowOrderServices(mockModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return orders with delivery dates for tomorrow', async () => {
    // Mock current date to control "tomorrow"
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];

    // Mock data
    mockModel.exec.mockResolvedValue([
      {
        orderId: '1',
        deliveryDate: tomorrowISO,
        deliveryTo: tomorrowISO,
        deliveryFrom: tomorrowISO,
      },
      {
        orderId: '2',
        deliveryDate: '2024-10-01',
        deliveryTo: '2024-10-02',
        deliveryFrom: '2024-09-30',
      },
      {
        orderId: '3',
        deliveryDate: '2024-10-03',
        deliveryTo: '2024-10-04',
        deliveryFrom: '2024-10-02',
      },
      {
        orderId: '4',
        deliveryDate: '2024-10-05',
        deliveryTo: tomorrowISO,
        deliveryFrom: tomorrowISO,
      }
    ]);

    const response = await service.getTomorrowOrders({});

    expect(logger.info).toHaveBeenCalledWith('Inside getTomorrowOrders method');
    expect(mockModel.exec).toHaveBeenCalledTimes(1);
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, [
      {
        orderId: '1',
        deliveryDate: tomorrowISO,
        deliveryTo: tomorrowISO,
        deliveryFrom: tomorrowISO,
      },
      {
        orderId: '4',
        deliveryDate: '2024-10-05',
        deliveryTo: tomorrowISO,
        deliveryFrom: tomorrowISO,
      }
    ]);
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Database error';
    mockModel.exec.mockRejectedValue(new Error(errorMessage));

    const response = await service.getTomorrowOrders({});

    expect(logger.error).toHaveBeenCalledWith(`Error in Get tomorrow order API: ${errorMessage}`);
    expect(sendResponse).toHaveBeenCalledWith(CODES.INTERNAL_SERVER_ERROR, 'Error in Get tomorrow order API');
  });
});