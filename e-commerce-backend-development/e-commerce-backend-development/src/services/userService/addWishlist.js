import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class AddUserWishlistService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  // Method to add a product ID to an existing user's wishlist
  addUserWishlist = async req => {
    try {
      logger.info('Inside addUserWishlist method');

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

      // Check if productId is already in the wishlist
      if (currentUser.wishlist.includes(productId)) {
        return sendResponse(CODES.CONFLICT, 'Product is already in the wishlist');
      }

      // Update the user's wishlist
      const result = await this.#userModel.update(
        { email: user.email }, // Key for the user
        {
          $ADD: {
            wishlist: [productId], // Append the new product ID to the wishlist
          },
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Product added to wishlist successfully');
      return sendResponse(CODES.OK, { wishlist: result.wishlist }); // Return the updated wishlist
    } catch (error) {
      logger.error(`Error in addUserWishlist API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addUserWishlist API');
    }
  }
}
