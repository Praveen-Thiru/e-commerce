import express from 'express';
import {
  loginUser,
  signupUser,
  otpToResetPassword,
  getUsers,
  getOne,
  toResetPassword,
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
} from '../controller/user.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/signup', signupUser);
userRouter.get('/getOTP/:email', otpToResetPassword);
userRouter.post('/verifyOtp', otpToResetPassword);
userRouter.post('/changePassword', toResetPassword);
userRouter.get('/getOne/:id', verifyJWTToken, getOne);
userRouter.get('/getUsers', verifyJWTToken, getUsers);
userRouter.put('/addAddress', verifyJWTToken, addAddress)
userRouter.put('/editAddress', verifyJWTToken, editAddress)
userRouter.put('/removeAddress', verifyJWTToken, removeAddress)
userRouter.get('/getInfo', verifyJWTToken, getUserInfo);
userRouter.put('/addToWishlist',verifyJWTToken, addWishlist)
userRouter.put('/removeToWishlist',verifyJWTToken, editWishlist)
userRouter.get('/getWishlist',verifyJWTToken, getWishlist)
userRouter.put('/addToCart',verifyJWTToken, addCartItem)
userRouter.put('/removeToCart',verifyJWTToken, editCartItem)
userRouter.get('/getCart',verifyJWTToken, getCartItems)

export { userRouter };
