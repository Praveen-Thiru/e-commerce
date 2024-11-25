import { logger } from '../logger/logger.js';
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';


export default class GetUserService {
  #userModel;

  constructor(userModel) {
    this.#userModel = userModel;
  }

  getUserInfo = async req => {
    try {
      logger.info('Inside getUserInfo method');
      const { user } = req.body;
      // Perform scan operation to get all users
      const userInfo = await this.#userModel.get(user.email)
      if (!userInfo)return sendResponse(CODES.NOT_FOUND, 'Not Found');
      return sendResponse(CODES.OK, userInfo);
    } catch (error) {
      logger.error(`Error in Get User Info API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get User Info API');
    }
  }

}
