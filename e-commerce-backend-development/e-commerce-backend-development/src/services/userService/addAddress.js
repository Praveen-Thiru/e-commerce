import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class AddUserAddressService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  // Method to add a new address to an existing user
  addUserAddress = async req => {
    try {
      logger.info('Inside addUserAddress method');

      const { user, newAddress } = req.body; // Expecting email and newAddress in the request body
      console.log(user, newAddress);
      
      // Validate input
      if (!user.email || !newAddress) {
        return sendResponse(CODES.BAD_REQUEST, 'Email and new address are required');
      }

      // Find the user by email
      const userData = await this.#userModel.get(user.email);
      if (!userData) {
        return sendResponse(CODES.NOT_FOUND, 'User not found');
      }

      // Add the new address to the existing address array
      userData.address.push(newAddress);

      // Save the updated user
      const data = await userData.save();

      logger.info('Address added successfully');
      return sendResponse(CODES.OK, data); // Return the updated user object
    } catch (error) {
      logger.error(`Error in addUserAddress API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addUserAddress API');
    }
  }
}
