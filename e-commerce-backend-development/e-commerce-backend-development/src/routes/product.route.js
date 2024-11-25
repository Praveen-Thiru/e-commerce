import express from 'express';
import { addProduct, getProducts,getProductsByCategory, getProductById, updateProduct, deleteProduct,addReview, removeReview, getProductDetails } from '../controller/product.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const productRouter = express.Router();

productRouter.post('/addProduct',verifyJWTToken, addProduct);
productRouter.get('/getProducts', getProducts);
productRouter.get('/getByCategory/:category', getProductsByCategory);
productRouter.get('/getOne/:id', getProductById);
productRouter.put('/updateProduct/:id',verifyJWTToken, updateProduct);
productRouter.delete('/delete/:id',verifyJWTToken, deleteProduct);
productRouter.put('/addReview',verifyJWTToken, addReview);
productRouter.put('/removeReview',verifyJWTToken, removeReview);
productRouter.get('/getDetails/:productId', getProductDetails);


export { productRouter };
