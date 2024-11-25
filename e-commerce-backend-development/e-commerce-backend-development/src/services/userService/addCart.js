import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class AddUserCartService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  // Method to add a product to an existing user's cart
  addUserCart = async req => {
    try {
      logger.info('Inside addUserCart method');

      const { user, productId, quantity } = req.body; // Expecting email, productId, and quantity in the request body
      
      // Validate input
      if (!user?.email || !productId || !quantity) {
        return sendResponse(CODES.BAD_REQUEST, 'Email, productId, and quantity are required');
      }

      // Fetch the current user data
      const currentUser = await this.#userModel.get(user.email);
      if (!currentUser) {
        return sendResponse(CODES.NOT_FOUND, 'User not found');
      }

      // Check if the product already exists in the cart
      const existingCartItem = currentUser.cart.find(item => item.productId === productId);
      
      if (existingCartItem) {
        // If the product exists, update the quantity
        existingCartItem.quantity += quantity;
      } else {
        // If the product does not exist, add it to the cart
        currentUser.cart.push({ productId, quantity });
      }

      // Update the user's cart
      const result = await this.#userModel.update(
        { email: user.email }, // Key for the user
        {
          cart: currentUser.cart // Update the cart with the modified array
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Product added to cart successfully');
      return sendResponse(CODES.OK, { cart: result.cart }); // Return the updated cart
    } catch (error) {
      logger.error(`Error in addUserCart API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addUserCart API');
    }
  }
}
