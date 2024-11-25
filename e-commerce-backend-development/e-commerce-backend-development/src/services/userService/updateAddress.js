import { logger } from '../../logger/logger.js';
import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';

export default class EditUserAddressService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  // Method to edit an existing address of a user
  editUserAddress = async req => {
    try {
      logger.info('Inside editUserAddress method');

      const { user, addressId, updatedAddress } = req.body; // Expecting email, addressId, and updatedAddress in the request body

      // Validate input
      if (!user.email || !addressId || !updatedAddress) {
        return sendResponse(CODES.BAD_REQUEST, 'Email, address ID, and updated address are required');
      }

      // Find the user by email
      const userData = await this.#userModel.get(user.email);
      if (!userData) {
        return sendResponse(CODES.NOT_FOUND, 'User not found');
      }

      // Find the address by addressId
      const addressIndex = userData.address.findIndex(address => address.id === addressId); // Assuming each address has a unique id
      if (addressIndex === -1) {
        return sendResponse(CODES.NOT_FOUND, 'Address not found');
      }

      // Update the existing address
      userData.address[addressIndex] = {
        ...userData.address[addressIndex],
        ...updatedAddress,
      };

      // Save the updated user
      await userData.save();

      logger.info('Address updated successfully');
      return sendResponse(CODES.OK, userData); // Return the updated user object
    } catch (error) {
      logger.error(`Error in editUserAddress API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in editUserAddress API');
    }
  }

  // Method to remove an address from a user's address list
  removeUserAddress = async req => {
    try {
      logger.info('Inside removeUserAddress method');

      const { user, addressId } = req.body; // Expecting email and addressId in the request body

      // Validate input
      if (!user.email || !addressId) {
        return sendResponse(CODES.BAD_REQUEST, 'Email and address ID are required');
      }

      // Find the user by email
      const userData = await this.#userModel.get(user.email);
      if (!userData) {
        return sendResponse(CODES.NOT_FOUND, 'User not found');
      }

      // Find the address by addressId
      const addressIndex = userData.address.findIndex(address => address.id === addressId);
      if (addressIndex === -1) {
        return sendResponse(CODES.NOT_FOUND, 'Address not found');
      }

      // Remove the address from the address array
      userData.address.splice(addressIndex, 1);

      // Save the updated user
      await userData.save();

      logger.info('Address removed successfully');
      return sendResponse(CODES.OK, userData); // Return the updated user object
    } catch (error) {
      logger.error(`Error in removeUserAddress API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in removeUserAddress API');
    }
  }
}

