import express from 'express';
import { addBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from '../controller/blog.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const blogRouter = express.Router();

blogRouter.post('/addBlog',verifyJWTToken, addBlog);
blogRouter.get('/getBlogs', getBlogs);
blogRouter.get('/getOne/:id', getBlogById);
blogRouter.put('/updateBlog/:id',verifyJWTToken, updateBlog);
blogRouter.delete('/delete/:id',verifyJWTToken, deleteBlog);


export { blogRouter };
