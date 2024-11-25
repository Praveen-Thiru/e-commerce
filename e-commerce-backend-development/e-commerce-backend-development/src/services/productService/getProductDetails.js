import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';


export default class getProductDetailsService {
  #productModel;
  #reviewModel;

  constructor(productModel, reviewModel) {
    this.#productModel = productModel;
    this.#reviewModel = reviewModel;
  }
    
  

  getproductDetails = async req => {
    try {
        logger.info('Inside product Details method');
        const {productId} = req.params
        
        // Perform scan operation to get all
   
        const product = await this.#productModel.get(productId);
        
        if(!product)return sendResponse(CODES.NOT_FOUND, 'No Products Available This Category');
        console.log(product);
        

        const review = await this.#reviewModel.batchGet(product.review.map(id => ({ reviewId: id })));
        console.log(review);
        

        return sendResponse(CODES.OK, {product: product ,review: review});
    } catch (error) {
        logger.error(`Error in Get All API: ${error.message}`);
        return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API');
      }
};
}
