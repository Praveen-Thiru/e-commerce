import RescheduleAppointmentService from '../../src/services/appointmentService/rescheduled.js'; // Adjust the path as necessary
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { transporter, mailObj } from '../../src/common/mail.config.js';

// Mock the logger and mail transporter
jest.mock('../../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../src/common/mail.config.js', () => ({
  mailObj: jest.fn().mockImplementation(({ subject, content, mailto }) => ({
    subject,
    content,
    to: mailto,
  })),
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe('RescheduleAppointmentService', () => {
  let appointModelMock;
  let rescheduleAppointmentService;

  beforeEach(() => {
    appointModelMock = {
      get: jest.fn(),
    };
    rescheduleAppointmentService = new RescheduleAppointmentService(appointModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should reschedule appointment successfully', async () => {
    const req = {
      body: {
        appointmentId: '123',
        newDate: '2024-10-15',
        newTime: '10:00 AM',
      },
    };

    const mockAppointment = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      save: jest.fn().mockResolvedValue({ appointmentId: '123', date: '2024-10-15', time: '10:00 AM' }),
    };

    appointModelMock.get.mockResolvedValue(mockAppointment);

    const response = await rescheduleAppointmentService.rescheduleAppointment(req);

    expect(response).toEqual(sendResponse(CODES.OK, 'Appointment rescheduled successfully', { appointmentId: '123', date: '2024-10-15', time: '10:00 AM' }));
    expect(mockAppointment.date).toBe('2024-10-15');
    expect(mockAppointment.time).toBe('10:00 AM');
    expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Your Appointment Rescheduled',
      content: expect.stringContaining('Your appointment at Veerababu Hospital has been rescheduled successfully!'),
      to: 'john.doe@example.com',
    }));
  });

  test('should return BAD_REQUEST if required fields are missing', async () => {
    const req = { body: {} };

    const response = await rescheduleAppointmentService.rescheduleAppointment(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Provide appointmentId, newDate, and newTime to reschedule'));
  });

  test('should return NOT_FOUND if the appointment does not exist', async () => {
    const req = {
      body: {
        appointmentId: '123',
        newDate: '2024-10-15',
        newTime: '10:00 AM',
      },
    };

    appointModelMock.get.mockResolvedValue(null);

    const response = await rescheduleAppointmentService.rescheduleAppointment(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'Appointment not found'));
  });

  test('should return INTERNAL_SERVER_ERROR on unexpected errors', async () => {
    const req = {
      body: {
        appointmentId: '123',
        newDate: '2024-10-15',
        newTime: '10:00 AM',
      },
    };

    appointModelMock.get.mockRejectedValue(new Error('Database error'));

    const response = await rescheduleAppointmentService.rescheduleAppointment(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in rescheduling appointment'));
  });
});
