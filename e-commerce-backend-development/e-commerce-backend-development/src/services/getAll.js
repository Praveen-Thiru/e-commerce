import { logger } from '../logger/logger.js';
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';


export default class GetAllServices {
  #Model;

  constructor(Model) {
    this.#Model = Model;
  }

  //get all items
  getAll = async req => {
    try {
      logger.info('Inside getAll method');
     
      // Perform scan operation to get all
      const userList = await this.#Model.scan().exec();
      return sendResponse(CODES.OK, userList);
    } catch (error) {
      logger.error(`Error in Get All API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API');
    }
  }
  

}
