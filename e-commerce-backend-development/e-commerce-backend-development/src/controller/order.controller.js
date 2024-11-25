import { logger } from '../logger/logger.js';
import { OrderModel } from '../models/order.model.js';
import { ProductModel } from '../models/product.model.js';
import PostOrderService from '../services/orderService/addOrder.js';
import BasicServices from '../services/basicCRUD.js';
import getUserOrderService from '../services/orderService/getUserOrders.js';
import GetTomorrowOrderServices from '../services/orderService/getTomorowOrders.js';
import GetNextOrderServices from '../services/orderService/getNextOrders.js';


const addOrder = async (req, res) => {
    logger.info(`Post Order api is Executing`);
    const postOrderService = new PostOrderService(OrderModel, ProductModel);
    const responseMessage = await postOrderService.addOrder(req);
    logger.info(`Post Order api is Executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

const getOrders = async (req, res) => {
  logger.info(`Get Order api Executing`);
  const getOrderService = new BasicServices(OrderModel);
  const responseMessage = await getOrderService.getAll(req);
  logger.info(`Get Order api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getOrdersByUser = async (req, res) => {
  logger.info(`Get Order by user api Executing`);
  const getOrderService = new getUserOrderService(OrderModel);
  const responseMessage = await getOrderService.getUserOrder(req);
  logger.info(`Get Order by user api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getOrderById = async (req, res) => {
  logger.info('Get Order By iD api is Executing');
  const getOrderByIdService = new BasicServices(OrderModel);
  const responseMessage = await getOrderByIdService.getOne(req);
  logger.info(`Get Order By Id Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const updateOrder = async (req, res) => {
  logger.info('Update Order API is Executing');
  const updateOrderService = new BasicServices(OrderModel);
  const responseMessage = await updateOrderService.updateOne(req);
  logger.info('Update Order API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const deleteOrder = async (req, res) => {
  logger.info(`delete Order api is executing`);
  const deleteOrderService = new BasicServices(OrderModel);
  const responseMessage = await deleteOrderService.deleteOne(req);
  logger.info(`delete Order api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const tomorrowOrder = async (req, res) => {
  logger.info(`tomorrow Order api is executing`);
  const tomorrowOrderService = new GetTomorrowOrderServices(OrderModel);
  const responseMessage = await tomorrowOrderService.getTomorrowOrders(req);
  logger.info(`tomorrow Order api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const nextOrder = async (req, res) => {
  logger.info(`next Order api is executing`);
  const nextOrderService = new GetNextOrderServices(OrderModel);
  const responseMessage = await nextOrderService.getNextOrders(req);
  logger.info(`next Order api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

  export { addOrder, getOrders,getOrdersByUser, getOrderById, updateOrder, deleteOrder, tomorrowOrder, nextOrder };