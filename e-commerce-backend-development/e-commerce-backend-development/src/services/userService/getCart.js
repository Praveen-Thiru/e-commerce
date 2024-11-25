import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class GetUserCartService {
  #userModel;
  #productModel;

  constructor(userModel, productModel) {
    this.#userModel = userModel;
    this.#productModel = productModel;
  }

  getUserCart = async req => {
    try {
      logger.info('Inside getUserCart method');
      const { user } = req.body;

      // Fetch user info
      const userInfo = await this.#userModel.get(user.email);
      if (!userInfo) return sendResponse(CODES.NOT_FOUND, 'User Not Found');

      // Extract product items from cart
      const cartItems = userInfo.cart;
      if (!cartItems || cartItems.length === 0) return sendResponse(CODES.NOT_FOUND, 'Cart is empty');

      // Fetch product details using get method for each product in the cart
      const productDetailsPromises = cartItems.map(item => this.#productModel.get(item.productId));
      const productDetails = await Promise.all(productDetailsPromises);

      // Combine product details with the quantities from the cart
      const detailedCartItems = productDetails.map((product, index) => ({
        ...product,
        cartQuantity: cartItems[index].quantity,
      }));

      return sendResponse(CODES.OK, detailedCartItems);
    } catch (error) {
      logger.error(`Error in Get User Cart API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get User Cart API');
    }
  }
}
