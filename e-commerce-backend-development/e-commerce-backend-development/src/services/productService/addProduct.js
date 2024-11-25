import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class PostProductService {
  #productModel;
  constructor(productModel) {
    this.#productModel = productModel;
  }
    
  

  addProduct = async req => {
    try {
      
      // Validate required fields
      if (
        !req.body.productName ||
        !req.body.category ||
        !req.body.quantity ||
        !req.body.price 
      ) {
        return sendResponse(CODES.BAD_REQUEST, 'All the fields are mandatory');
      }

      const data = req.body;
      
      // Create and save the product using Dynamoose
      const product = new this.#productModel(
        data
      );

      await product.save();
      return sendResponse(CODES.OK, 'Product added successfully');
    } catch (error) {
      logger.error(error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in post product  API');
    }
  };
}
