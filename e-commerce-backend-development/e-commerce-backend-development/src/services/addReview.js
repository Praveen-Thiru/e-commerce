import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';

export default class PostReviewService {
  #ReviewModel;
  #ProductModel;

  constructor(ReviewModel, ProductModel) {
    this.#ReviewModel = ReviewModel;
    this.#ProductModel = ProductModel;
  }

  addReview = async req => {
    try {
      console.log('Request Data:', req.body);
      const data = req.body;

      // Validate required fields
      if (!data.productId || !data.rating) {
        console.log('Validation Error: Missing fields');
        return sendResponse(CODES.BAD_REQUEST, 'Missing productId and rating');
      }

      // Retrieve the product
      const product = await this.#ProductModel.get(data.productId);
      console.log('Retrieved Product:', product);

      // Check if the product exists
      if (!product) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found');
      }

      // Prepare review data
      data.userEmail = data.user.email;
      data.userName = data.user.username;

      const review = new this.#ReviewModel(data);
      console.log('Review to Save:', review);
      await review.save();

      // Retrieve all reviews for the product
      const reviews = await this.#ReviewModel.scan('productId').eq(product.productId).exec();
      console.log('Retrieved Reviews:', reviews);

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

      // Update product with the new average rating
      await this.#ProductModel.update(data.productId, { overAllRating: averageRating });

      return sendResponse(CODES.OK, 'Review added successfully and product rating updated');
    } catch (error) {
      console.error('Error caught in addReview:', error); 
      logger.error(error); // Log the error for debugging
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in adding review');
    }
  };
}
