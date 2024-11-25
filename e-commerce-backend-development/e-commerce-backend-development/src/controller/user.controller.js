import { userModel } from '../models/user.model.js';
import { ProductModel } from '../models/product.model.js';
import UserLoginService from '../services/login.js';
import UserSignupService from '../services/signup.js';
import { logger } from '../logger/logger.js';
import GetUserService from '../services/getUserInfo.js';
import GetOtpService from '../services/getOtp.js';
import BasicServices from '../services/basicCRUD.js';
import AddUserAddressService from '../services/userService/addAddress.js';
import EditUserAddressService from '../services/userService/updateAddress.js';
import AddUserWishlistService from '../services/userService/addWishlist.js';
import EditUserWishlistService from '../services/userService/removeWishlist.js';
import GetUserWishlistService from '../services/userService/getWishlist.js';
import AddUserCartService from '../services/userService/addCart.js';
import EditUserCartService from '../services/userService/removeCart.js';
import GetUserCartService from '../services/userService/getCart.js';



const loginUser = async (req, res) => {
  logger.info(`Login api Executing`);
  const userLoginService = new UserLoginService(userModel);
  const responseMessage = await userLoginService.login(req);
  logger.info(`Login api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const signupUser = async (req, res) => {
  logger.info(`Signup api Executing`);
  const userSignupService = new UserSignupService(userModel);
  const responseMessage = await userSignupService.signup(req);
  logger.info(`Signup api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const getUsers = async (req, res) => {
  logger.info('GetUsers API Executing');
  const getUserListService = new BasicServices(userModel);
  const responseMessage = await getUserListService.getAll(req);
  res.status(responseMessage.status).json(responseMessage);
  logger.info('GetUsers API Executed');
};


const otpToResetPassword = async (req, res) => {
  logger.info('Get OTP service is executing');
  const getOtpService = new GetOtpService(userModel);
  let responseMessage;
  if (req.method === 'GET') {
    responseMessage = await getOtpService.getOtp(req);
  } else responseMessage = await getOtpService.verifyOtp(req);
  res.status(responseMessage.status).json(responseMessage);
  logger.info('Get OTP service is executing');
};

const toResetPassword = async (req, res) => {
  logger.info('Change Password service is executing');
  const getOtpService = new GetOtpService(userModel);
  const responseMessage = await getOtpService.changePassword(req);
  res.status(responseMessage.status).json(responseMessage);
  logger.info('Change Password service is executing');
};

const getOne = async (req, res) => {
  logger.info(`get one user api Executing`);
  const userService = new BasicServices(userModel);
  const responseMessage = await userService.getOne(req);
  logger.info(`get one user api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const addAddress = async (req, res) => {
  logger.info(`Add user Address api Executing`);
  const addAddressService = new AddUserAddressService(userModel);
  const responseMessage = await addAddressService.addUserAddress(req);
  logger.info(`Add user Address api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const editAddress = async (req, res) => {
  logger.info(`Edit user Address api Executing`);
  const editAddressService = new EditUserAddressService(userModel);
  const responseMessage = await editAddressService.editUserAddress(req);
  logger.info(`Edit user Address api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const removeAddress = async (req, res) => {
  logger.info(`Edit user Address api Executing`);
  const editAddressService = new EditUserAddressService(userModel);
  const responseMessage = await editAddressService.removeUserAddress(req);
  logger.info(`Edit user Address api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getUserInfo = async (req, res) => {
  logger.info(`get userInfo api Executing`);
  const userInfoService = new GetUserService(userModel);
  const responseMessage = await userInfoService.getUserInfo(req);
  logger.info(`get userInfo api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const addWishlist = async (req, res) => {
  logger.info(`Add wishlist api Executing`);
  const addWishlistService = new AddUserWishlistService(userModel);
  const responseMessage = await addWishlistService.addUserWishlist(req);
  logger.info(`Add wishlist api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const editWishlist = async (req, res) => {
  logger.info(`Edit wishlist api Executing`);
  const editWishlistService = new EditUserWishlistService(userModel);
  const responseMessage = await editWishlistService.removeProductFromWishlist(req);
  logger.info(`Edit wishlist api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getWishlist = async (req, res) => {
  logger.info(`get Wishlist api Executing`);
  const userLoginService = new GetUserWishlistService(userModel, ProductModel);
  const responseMessage = await userLoginService.getUserWishlist(req);
  logger.info(`get Wishlist api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const addCartItem = async (req, res) => {
  logger.info(`Add cart item API executing`);
  const addCartService = new AddUserCartService(userModel);
  const responseMessage = await addCartService.addUserCart(req);
  logger.info(`Add cart item API executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const editCartItem = async (req, res) => {
  logger.info(`Edit cart item API executing`);
  const editCartService = new EditUserCartService(userModel);
  const responseMessage = await editCartService.removeProductFromCart(req);
  logger.info(`Edit cart item API executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getCartItems = async (req, res) => {
  logger.info(`Get cart items API executing`);
  const getUserCartService = new GetUserCartService(userModel, ProductModel);
  const responseMessage = await getUserCartService.getUserCart(req);
  logger.info(`Get cart items API executed`);
  res.status(responseMessage.status).json(responseMessage);
};





export {
  loginUser,
  signupUser,
  getUsers,
  otpToResetPassword,
  toResetPassword,
  getOne,
  addAddress,
  editAddress,
  removeAddress,
  getUserInfo,
  addWishlist,
  editWishlist,
  getWishlist,
  addCartItem,
  editCartItem,
  getCartItems

};
