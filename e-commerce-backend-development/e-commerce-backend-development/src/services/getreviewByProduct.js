import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';


export default class GetProductReviewService {
  #ReviewModel;

  constructor(ReviewModel) {
    this.#ReviewModel = ReviewModel;
  }


  getReviewByProduct = async req => {
    try {
        logger.info('Inside getByCategory method');
        
        // Perform scan operation to get all
   
        const ReviewList = await this.#ReviewModel.scan('productId').eq(req.params.productId).exec();
        
        if(ReviewList.length===0)return sendResponse(CODES.NOT_FOUND, 'No Reviews Available For This Product');
        return sendResponse(CODES.OK, ReviewList);
    } catch (error) {
        logger.error(`Error in Get All API: ${error.message}`);
        return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API');
      }
  };

  

  
}
