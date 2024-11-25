import express from 'express';
import { addReview, getReviews,getReviewsByProduct, getReviewById, updateReview, deleteReview } from '../controller/review.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/addReview',verifyJWTToken, addReview);
reviewRouter.get('/getReviews', getReviews);
reviewRouter.get('/productReview/:productId', getReviewsByProduct);
reviewRouter.get('/getOne/:id', getReviewById);
reviewRouter.put('/updateReview/:id',verifyJWTToken, updateReview);
reviewRouter.delete('/delete/:id',verifyJWTToken, deleteReview);


export { reviewRouter };
