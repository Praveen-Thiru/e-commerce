import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class GetNextOrderServices {
  #Model;

  constructor(Model) {
    this.#Model = Model;
  }

  // Get all items filtered by delivery date
  getNextOrders = async req => {
    try {
      logger.info('Inside getNextOrders method');

      // Calculate tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowISO = tomorrow.toISOString().split('T')[0]; // Get YYYY-MM-DD format

      // Perform scan operation and filter
      const ordersList = await this.#Model.scan().exec();

      // Filter based on delivery conditions
      const filteredList = ordersList.filter(item => {
        const deliveryDate = item.deliveryDate && new Date(item?.deliveryDate).toISOString().split('T')[0];
        const deliveryToDate = item.deliveryTo && new Date(item?.deliveryTo).toISOString().split('T')[0];
        

        return (
          deliveryDate >= tomorrowISO ||
           deliveryToDate >= tomorrowISO
        );
      });

      return sendResponse(CODES.OK, filteredList);
    } catch (error) {
      logger.error(`Error in Get next order API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get next order API');
    }
  }
}
