import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class getByCategoryService {
  #productModel;
  constructor(productModel) {
    this.#productModel = productModel;
  }
    
  

  getByCategory = async req => {
    try {
        logger.info('Inside getByCategory method');
        
        // Perform scan operation to get all
   
        const productList = await this.#productModel.scan('category').eq(req.params.category).exec();
        console.log(productList);
        
        if(productList.length===0)return sendResponse(CODES.NOT_FOUND, 'No Products Available This Category');
        return sendResponse(CODES.OK, productList);
    } catch (error) {
        logger.error(`Error in Get All API: ${error.message}`);
        return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API');
      }
};
}
