import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class RemoveProductReviewService {
  #productModel;

  constructor(productModel) {
    this.#productModel = productModel;
  }

  // Method to remove a review from an existing product
  removeProductReview = async req => {
    try {
      logger.info('Inside removeProductReview method');

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

      // Check if the reviewId exists in the current product's reviews
      if (!currentProduct.review.includes(reviewId)) {
        return sendResponse(CODES.NOT_FOUND, 'Review not found in product reviews');
      }

      // Update the product's reviews by removing the reviewId
      const updatedReviews = currentProduct.review.filter(id => id !== reviewId);
      const result = await this.#productModel.update(
        { productId: productId }, // Key for the product
        {
          review: updatedReviews, // Update the product's reviews
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Review removed successfully');
      return sendResponse(CODES.OK, { reviews: result.review }); // Return the updated reviews
    } catch (error) {
      logger.error(`Error in removeProductReview API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeProductReview API');
    }
  }
}
