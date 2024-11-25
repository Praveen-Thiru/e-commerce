import { logger } from '../logger/logger.js';
import { ProductModel } from '../models/product.model.js';
import { ReviewModel } from '../models/review.model.js';
import PostProductService from '../services/productService/addProduct.js';
import BasicServices from '../services/basicCRUD.js';
import getByCategoryService from '../services/productService/getByCategory.js';
import AddProductReviewService from '../services/productService/addReview.js';
import RemoveProductReviewService from '../services/productService/removeReview.js';
import getProductDetailsService from '../services/productService/getProductDetails.js';

const addProduct = async (req, res) => {
    logger.info(`Post product api is Executing`);
    const postProductService = new PostProductService(ProductModel);
    const responseMessage = await postProductService.addProduct(req);
    logger.info(`Post product api is Executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

const getProducts = async (req, res) => {
  logger.info(`Get product api Executing`);
  const getProductService = new BasicServices(ProductModel);
  const responseMessage = await getProductService.getAll(req);
  logger.info(`Get product api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getProductsByCategory = async (req, res) => {
  logger.info(`Get product by category api Executing`);
  const getProductService = new getByCategoryService(ProductModel);
  const responseMessage = await getProductService.getByCategory(req);
  logger.info(`Get product by category api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getProductById = async (req, res) => {
  logger.info('Get Product By iD api is Executing');
  const getProductByIdService = new BasicServices(ProductModel);
  const responseMessage = await getProductByIdService.getOne(req);
  logger.info(`Get Product By Id Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const updateProduct = async (req, res) => {
  logger.info('Update Product API is Executing');
  const updateProductService = new BasicServices(ProductModel);
  const responseMessage = await updateProductService.updateOne(req);
  logger.info('Update Product API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const deleteProduct = async (req, res) => {
  logger.info(`delete product api is executing`);
  const deleteProductService = new BasicServices(ProductModel);
  const responseMessage = await deleteProductService.deleteOne(req);
  logger.info(`delete product api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const addReview = async (req, res) => {
  logger.info('Update Product review API is Executing');
  const updateProductService = new AddProductReviewService(ProductModel);
  const responseMessage = await updateProductService.addProductReview(req);
  logger.info('Update Product API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const removeReview = async (req, res) => {
  logger.info('Update Product review API is Executing');
  const updateProductService = new RemoveProductReviewService(ProductModel);
  const responseMessage = await updateProductService.removeProductReview(req);
  logger.info('Update Product API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const getProductDetails = async (req, res) => {
  logger.info(`Get product Details api Executing`);
  const getProductService = new getProductDetailsService(ProductModel, ReviewModel);
  const responseMessage = await getProductService.getproductDetails(req);
  logger.info(`Get product Details api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


  export { addProduct, getProducts,getProductsByCategory, getProductById, updateProduct, deleteProduct, addReview, removeReview, getProductDetails  };