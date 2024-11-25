import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class AddProductReviewService {
  #productModel;

  constructor(productModel) {
    this.#productModel = productModel;
  }

  // Method to add a review to an existing product
  addProductReview = async req => {
    try {
      logger.info('Inside addReview method');

      const { productId, reviewId } = req.body; // Expecting productId and reviewId in the request body
      
      // Validate input
      if (!productId || !reviewId) {
        return sendResponse(CODES.BAD_REQUEST, 'ProductId and reviewId are required');
      }

      // Fetch the current product data
      const currentProduct = await this.#productModel.get(productId);
      if (!currentProduct) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found');
      }

      if( currentProduct?.review.length === 10){
        return sendResponse(CODES.BAD_REQUEST, 'Already have 10 reviews');
      }

   

      // Update the product's reviews
      const result = await this.#productModel.update(
        { productId: productId }, // Key for the product
        {
          $ADD: {
            review: [reviewId], // Append the new reviewId to the product's reviews
          },
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Review added successfully');
      return sendResponse(CODES.OK, { reviews: result.review }); // Return the updated reviews
    } catch (error) {
      logger.error(`Error in addProductReview API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addProductReview API');
    }
  }
}
