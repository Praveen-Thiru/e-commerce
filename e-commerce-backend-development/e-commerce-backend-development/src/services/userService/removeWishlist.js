import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class EditUserWishlistService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }


  // Method to remove an wishlist from a user's wishlist list
  removeProductFromWishlist = async req => {
    try {
      logger.info('Inside removeProductFromWishlist method');

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

      // Check if productId is in the wishlist
      if (!currentUser.wishlist.includes(productId)) {
        return sendResponse(CODES.NOT_FOUND, 'Product not found in wishlist');
      }

      // Update the user's wishlist to remove the productId
      const updatedWishlist = currentUser.wishlist.filter(id => id !== productId);
      const result = await this.#userModel.update(
        { email: user.email }, // Key for the user
        {
          wishlist: updatedWishlist, // Set the wishlist to the new filtered array
        },
        { returnValues: 'UPDATED_NEW' } // Return updated data
      );

      logger.info('Product removed from wishlist successfully');
      return sendResponse(CODES.OK, { wishlist: result.wishlist }); // Return the updated wishlist
    } catch (error) {
      logger.error(`Error in removeProductFromWishlist API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeProductFromWishlist API');
    }
  };
}

