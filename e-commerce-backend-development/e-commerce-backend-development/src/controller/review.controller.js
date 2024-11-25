import { logger } from '../logger/logger.js';
import { ReviewModel } from '../models/review.model.js';
import { ProductModel } from '../models/product.model.js';
import PostReviewService from '../services/addReview.js';
import BasicServices from '../services/basicCRUD.js';
import GetProductReviewService from '../services/getreviewByProduct.js';

const addReview = async (req, res) => {
    logger.info(`Post review api is Executing`);
    const postReviewService = new PostReviewService(ReviewModel, ProductModel);
    const responseMessage = await postReviewService.addReview(req);
    logger.info(`Post review api is Executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

const getReviews = async (req, res) => {
  logger.info(`Get review api Executing`);
  const getReviewService = new BasicServices(ReviewModel);
  const responseMessage = await getReviewService.getAll(req);
  logger.info(`Get review api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getReviewsByProduct = async (req, res) => {
  logger.info(`Get reviewByProduct api Executing`);
  const getReviewService = new GetProductReviewService(ReviewModel);
  const responseMessage = await getReviewService.getReviewByProduct(req);
  logger.info(`Get reviewByProduct api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getReviewById = async (req, res) => {
  logger.info('Get Review By iD api is Executing');
  const getReviewByIdService = new BasicServices(ReviewModel);
  const responseMessage = await getReviewByIdService.getOne(req);
  logger.info(`Get Review By Id Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const updateReview = async (req, res) => {
  logger.info('Update Review API is Executing');
  const updateReviewService = new BasicServices(ReviewModel);
  const responseMessage = await updateReviewService.updateOne(req);
  logger.info('Update Review API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const deleteReview = async (req, res) => {
    logger.info(`delete review api is executing`);
    const deleteReviewService = new BasicServices(ReviewModel);
    const responseMessage = await deleteReviewService.deleteOne(req);
    logger.info(`delete review api is executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

  export { addReview, getReviews,getReviewsByProduct, getReviewById, updateReview, deleteReview };