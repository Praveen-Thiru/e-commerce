import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';

export default class PostOrderService {
  #orderModel;
  #productModel;
  

  constructor(orderModel, productModel) {
    this.#orderModel = orderModel;
    this.#productModel = productModel;
  }

  addOrder = async req => {
    const transaction = []; // Holds operations for rollback in case of failure
    try {
      logger.info('Adding a new order');

      const { user, products, status } = req.body;
      let totalPrice = 0;
      
      // Ensure all products are valid and available
      for (const product of products) {
        const productId = product.productId;
        const quantity = product.quantity;

        const productDetails = await this.#productModel.get({ productId: productId });

        if (!productDetails) {
          return sendResponse(CODES.BAD_REQUEST, `Invalid product ID ${productId}`);
        }

        if (productDetails.quantity < quantity) {
          return sendResponse(CODES.BAD_REQUEST, `Insufficient quantity for product ${productId}`);
        }

        const price =  productDetails.price;
        const gst = 0;
        const productPrice = price * quantity;
        const discountPrice = productPrice - (productPrice * productDetails.discount / 100);
        const productTotalPrice = discountPrice + (discountPrice * gst);

        product.price = price;
        product.quantity = quantity;
        product.totalPrice = productTotalPrice;
        product.productName = productDetails.productName;
        product.discount = productDetails.discount;
        product.imageUrl= productDetails.imageUrl;

        totalPrice += productTotalPrice;

        // Prepare to update product quantity
        transaction.push(async () => {
          const newQuantity = productDetails.quantity - quantity;
          await this.#productModel.update({ productId:productId }, { quantity: newQuantity });
        });
      }

      totalPrice = parseFloat(totalPrice.toFixed(2));


      const newOrder = {
        userEmail: user.email,
        userName: user.username,
        products,
        address: req.body.address,
        totalPrice: req.body.totalPrice,
        status,
        deliveryFrom: req.body.deliveryFrom,
        deliveryTo: req.body.deliveryTo,
        deliveryDate: req.body.deliveryDate
      };

      const order = await this.#orderModel.create(newOrder);

      // Execute all product updates
      for (const update of transaction) {
        await update();
      }

      return sendResponse(CODES.OK, 'Order added successfully', {orderId:order.orderId});
    } catch (error) {
      logger.error('Error in adding order:', error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in adding order');
    }
  };
}
