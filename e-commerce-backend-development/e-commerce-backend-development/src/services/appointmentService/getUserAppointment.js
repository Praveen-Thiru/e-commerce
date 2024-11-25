import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class UserAppointmentService {
  #appointModel;
  constructor(appointModel) {
    this.#appointModel = appointModel;
  }

  getUserAppointments = async req=> {
    try {
      logger.info('Fetching user\'s appointments');
      const {user} = req.body;


      // Fetch user appointments where the date is today
      const userAppointments = await this.#appointModel.scan("userEmail").eq(user.email).exec();

      if (userAppointments.length === 0) {
        return sendResponse(CODES.NOT_FOUND, 'No appointments found');
      }

      return sendResponse(CODES.OK, userAppointments);
    } catch (error) {
      logger.error(`Error fetching user's appointments: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error fetching user\'s appointments');
    }
  }


    
}


