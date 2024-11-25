import TodayAppointmentService from '../../src/services/appointmentService/todayAppointment.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/logger/logger.js');

describe('TodayAppointmentService', () => {
  let service;
  let mockAppointModel;

  beforeEach(() => {
    mockAppointModel = {
      scan: jest.fn(),
    };
    service = new TodayAppointmentService(mockAppointModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return today\'s appointments successfully', async () => {
    const mockAppointments = [
      { id: 1, date: new Date().toISOString().split('T')[0], time: '10:00 AM' },
      { id: 2, date: new Date().toISOString().split('T')[0], time: '11:00 AM' },
    ];

    mockAppointModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockAppointments),
    });

    const req = {}; // Mock request object
    const response = await service.getTodayAppointments(req);

    expect(mockAppointModel.scan).toHaveBeenCalledWith({
      filter: {
        date: new Date().toISOString().split('T')[0],
      },
    });
    expect(response).toEqual(sendResponse(CODES.OK, mockAppointments));
    expect(logger.info).toHaveBeenCalledWith('Fetching today\'s appointments');
  });

  test('should return not found when no appointments are today', async () => {
    mockAppointModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce([]),
    });

    const req = {}; // Mock request object
    const response = await service.getTodayAppointments(req);

    expect(mockAppointModel.scan).toHaveBeenCalledWith({
      filter: {
        date: new Date().toISOString().split('T')[0],
      },
    });
    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'No appointments found for today'));
  });

  test('should handle errors properly', async () => {
    const errorMessage = 'Database error';
    mockAppointModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    const req = {}; // Mock request object
    const response = await service.getTodayAppointments(req);

    expect(mockAppointModel.scan).toHaveBeenCalledWith({
      filter: {
        date: new Date().toISOString().split('T')[0],
      },
    });
    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error fetching today\'s appointments'));
    expect(logger.error).toHaveBeenCalledWith(`Error fetching today's appointments: ${errorMessage}`);
  });
});
