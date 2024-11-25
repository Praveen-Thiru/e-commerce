import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class EditUserCartService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  // Method to remove a product from a user's cart
  removeProductFromCart = async req => {
    try {
      logger.info('Inside removeProductFromCart method');

      const { user, productId } = req.body; // Expecting email and productId in the request body
      
      // Validate input
      if (!user?.email || !productId) {
        return sendResponse(CODES.BAD_REQUEST, 'Email and productId are required');
      }

      // Fetch the current user data
      const currentUser = await this.#userModel.get(user.email);
      if (!currentUser) {
        return sendResponse(CODES.NOT_FOUND, 'User not found');
      }

      // Check if productId is in the cart
      const cartItemIndex = currentUser.cart.findIndex(item => item.productId === productId);
      if (cartItemIndex === -1) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found in cart');
      }

      // Update the user's cart to remove the productId
      const updatedCart = currentUser.cart.filter(item => item.productId !== productId);
      const result = await this.#userModel.update(
        { email: user.email }, // Key for the user
        {
          cart: updatedCart, // Set the cart to the new filtered array
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Product removed from cart successfully');
      return sendResponse(CODES.OK, { cart: result.cart }); // Return the updated cart
    } catch (error) {
      logger.error(`Error in removeProductFromCart API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeProductFromCart API');
    }
  };
}
