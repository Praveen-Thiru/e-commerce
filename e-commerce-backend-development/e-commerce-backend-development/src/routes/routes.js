import express from 'express';
import { userRouter } from './user.routes.js';
import { productRouter } from './product.route.js';
import { blogRouter } from './blog.route.js';
import { reviewRouter } from './review.route.js';
import { appointmentRouter } from './appointment.route.js';
import { orderRouter } from './order.route.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/blog', blogRouter);
router.use('/review', reviewRouter);
router.use('/appointment', appointmentRouter)
router.use('/order', orderRouter)

export { router };
