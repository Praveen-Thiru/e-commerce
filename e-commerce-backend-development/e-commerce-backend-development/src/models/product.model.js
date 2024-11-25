import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';


const productSchema = new dynamoose.Schema(
  {
    productId: {
        type: String,
        default: uuidv4,
        hashKey:true,
      },
      productName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      review: {
        type: Array,
        schema: [String], // Array of review IDs
        default: []
      },
      unit: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0
      },
      imageUrl: {
        type: String,
      },
      description: {
        type: String,
      },
      overAllRating:{
        type: Number,
        default: 5
      },
      createdOn: {
        type: String,
        default: () => new Date().toISOString(),
    }
    });

const ProductModel = dynamoose.model('Product', productSchema, { tableName: 'siddha_product' }); 

export { ProductModel };
