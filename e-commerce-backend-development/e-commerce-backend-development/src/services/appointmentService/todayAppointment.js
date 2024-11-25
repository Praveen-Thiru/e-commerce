import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class TodayAppointmentService {
  #appointModel;
  constructor(appointModel) {
    this.#appointModel = appointModel;
  }

  getTodayAppointments = async req=> {
    try {
      logger.info('Fetching today\'s appointments');

      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date();
      const todayISOString = today.toISOString().split('T')[0]; // Extract YYYY-MM-DD

      // Fetch appointments where the date is today
      const todayAppointments = await this.#appointModel.scan({
        filter: {
          date: todayISOString,
        },
      }).exec();

      if (todayAppointments.length === 0) {
        return sendResponse(CODES.NOT_FOUND, 'No appointments found for today');
      }

      return sendResponse(CODES.OK, todayAppointments);
    } catch (error) {
      logger.error(`Error fetching today's appointments: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error fetching today\'s appointments');
    }
  }


    
}


