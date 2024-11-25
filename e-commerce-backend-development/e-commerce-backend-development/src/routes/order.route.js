import express from 'express';
import { addOrder, getOrders,getOrdersByUser, getOrderById, updateOrder, deleteOrder, tomorrowOrder, nextOrder } from '../controller/order.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/addOrder',verifyJWTToken, addOrder);
orderRouter.get('/getOrders',verifyJWTToken, getOrders);
orderRouter.get('/getUserOrder/:email',verifyJWTToken, getOrdersByUser);
orderRouter.get('/getOne/:id', getOrderById);
orderRouter.put('/updateOrder/:id',verifyJWTToken, updateOrder);
orderRouter.delete('/delete/:id',verifyJWTToken, deleteOrder);
orderRouter.get('/tomorrowOrders', tomorrowOrder);
orderRouter.get('/nextOrders', nextOrder);


export { orderRouter };
