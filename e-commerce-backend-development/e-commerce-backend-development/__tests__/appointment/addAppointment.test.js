import AddAppointmentService from '../../src/services/appointmentService/addAppointment.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';
import { logger } from '../../src/logger/logger.js';
import {  transporter, mailObj } from '../../src/common/mail.config.js';

jest.mock('../../src/common/common.js');
jest.mock('../../src/common/response-code.js');
jest.mock('../../src/logger/logger.js');
jest.mock('../../src/common/mail.config.js');

describe('AddAppointmentService', () => {
    let appointModelMock;
    let addAppointmentService;
  
    beforeEach(() => {
      appointModelMock = {
        create: jest.fn(),
      };
      addAppointmentService = new AddAppointmentService(appointModelMock);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('bookAppointment', () => {
      it('should return bad request if no data is provided', async () => {
        const req = { body: {} };
        const response = await addAppointmentService.bookAppointment(req);
        expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Provide data to save'));
      });
  
      it('should save appointment and send email successfully', async () => {
        const req = {
          body: {
            name: 'John Doe',
            date: '2023-10-10',
            time: '10:00 AM',
            email: 'johndoe@example.com',
          },
        };
        const savedData = { id: 1, ...req.body };
        appointModelMock.create.mockResolvedValue(savedData);
        
        // Mock mailObj to return a valid object
        mailObj.mockReturnValue({ to: req.body.email, subject: 'Your Appointment Booked', text: expect.any(String) });
        transporter.sendMail.mockResolvedValue(true); // Simulate successful email sending
  
        const response = await addAppointmentService.bookAppointment(req);
        expect(response).toEqual(sendResponse(CODES.CREATED, 'Item saved successfully', savedData));
        expect(appointModelMock.create).toHaveBeenCalledWith(req.body);
        expect(transporter.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: req.body.email }));
      });
  
      it('should handle errors when saving appointment', async () => {
        const req = {
          body: {
            name: 'John Doe',
            date: '2023-10-10',
            time: '10:00 AM',
            email: 'johndoe@example.com',
          },
        };
        appointModelMock.create.mockRejectedValue(new Error('Database error'));
  
        const response = await addAppointmentService.bookAppointment(req);
        expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in save API'));
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in save new data API'));
      });
  
      it('should handle errors when sending email', async () => {
        const req = {
          body: {
            name: 'John Doe',
            date: '2023-10-10',
            time: '10:00 AM',
            email: 'johndoe@example.com',
          },
        };
        const savedData = { id: 1, ...req.body };
        appointModelMock.create.mockResolvedValue(savedData);
        mailObj.mockReturnValue({ to: req.body.email, subject: 'Your Appointment Booked', text: expect.any(String) });
        transporter.sendMail.mockRejectedValue(new Error('Email error'));
  
        const response = await addAppointmentService.bookAppointment(req);
        expect(response).toEqual(sendResponse(CODES.CREATED, 'Item saved successfully', savedData));
        expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error in save new data API'));
      });
    });
  });
