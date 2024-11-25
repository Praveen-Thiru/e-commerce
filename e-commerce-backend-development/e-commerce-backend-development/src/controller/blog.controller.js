import { logger } from '../logger/logger.js';
import { BlogModel } from '../models/blog.model.js';
import BasicServices from '../services/basicCRUD.js';

const addBlog = async (req, res) => {
    logger.info(`Post Blog api is Executing`);
    const postBlogService = new BasicServices(BlogModel);
    const responseMessage = await postBlogService.createOne(req);
    logger.info(`Post Blog api is Executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

const getBlogs = async (req, res) => {
  logger.info(`Get Blog api Executing`);
  const getBlogService = new BasicServices(BlogModel);
  const responseMessage = await getBlogService.getAll(req);
  logger.info(`Get Blog api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getBlogById = async (req, res) => {
  logger.info('Get Blog By iD api is Executing');
  const getBlogByIdService = new BasicServices(BlogModel);
  const responseMessage = await getBlogByIdService.getOne(req);
  logger.info(`Get Blog By Id Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const updateBlog = async (req, res) => {
  logger.info('Update Blog API is Executing');
  const updateBlogService = new BasicServices(BlogModel);
  const responseMessage = await updateBlogService.updateOne(req);
  logger.info('Update Blog API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const deleteBlog = async (req, res) => {
    logger.info(`delete Blog api is executing`);
    const deleteBlogService = new BasicServices(BlogModel);
    const responseMessage = await deleteBlogService.deleteOne(req);
    logger.info(`delete Blog api is executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

  export { addBlog, getBlogs, getBlogById, updateBlog, deleteBlog };