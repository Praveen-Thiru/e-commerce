import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { mailObj, transporter } from '../../common/mail.config.js';

export default class GetTomorrowOrderServices {
  #Model;

  constructor(Model) {
    this.#Model = Model;
  }

  // Get all items filtered by delivery date
  getTomorrowOrders = async req => {
    try {
      logger.info('Inside getTomorrowOrders method');

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
        const deliveryFromDate = item.deliveryFrom && new Date(item?.deliveryFrom).toISOString().split('T')[0];

        
      

        return (
          deliveryDate === tomorrowISO ||
          (deliveryToDate >= tomorrowISO && deliveryFromDate <= tomorrowISO)
        );
      });

      await transporter.sendMail(
        await mailObj({
          subject: 'test',
          content: `tomorow order
          ${filteredList}`,
          mailto: 'mukilankumar003@gmail.com'
        })
      );

      return sendResponse(CODES.OK, filteredList);
    } catch (error) {
      logger.error(`Error in Get tomorrow order API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get tomorrow order API');
    }
  }
}
