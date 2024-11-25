import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class GetUserWishlistService {
  #userModel;
  #productModel;

  constructor(userModel, productModel) {
    this.#userModel = userModel;
    this.#productModel = productModel;
  }

  getUserWishlist = async req => {
    try {
      logger.info('Inside getUserWishlist method');
      const { user } = req.body;

      // Fetch user info
      const userInfo = await this.#userModel.get(user.email);
      if (!userInfo) return sendResponse(CODES.NOT_FOUND, 'User Not Found');

      // Extract product IDs from wishlist
      const productIds = userInfo.wishlist;
      if (!productIds || productIds.length === 0) return sendResponse(CODES.NOT_FOUND, 'Wishlist is empty');

      // Fetch product details using get method
      const productDetailsPromises = productIds.map(productId => this.#productModel.get(productId));
      const productDetails = await Promise.all(productDetailsPromises);


      return sendResponse(CODES.OK, productDetails);
    } catch (error) {
      logger.error(`Error in Get User Wishlist API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get User Wishlist API');
    }
  }
}
