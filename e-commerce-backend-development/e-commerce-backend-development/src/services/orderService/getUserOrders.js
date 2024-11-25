import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class getUserOrderService {
  #orderModel;
  constructor(orderModel) {
    this.#orderModel = orderModel;
  }
    
  

  getUserOrder = async req => {
    try {
        logger.info('Inside getByUser method');
        
        // Perform scan operation to get all
   
        const orderList = await this.#orderModel.scan('userEmail').eq(req.params.email).exec();
        console.log(orderList);
        
        if(orderList.length===0)return sendResponse(CODES.NOT_FOUND, 'No Orders Available For This User');
        return sendResponse(CODES.OK, orderList);
    } catch (error) {
        logger.error(`Error in Get User Order API: ${error.message}`);
        return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get Uder Order  API');
      }
};
}
