import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const reviewSchema = new dynamoose.Schema(
  {
    reviewId:{
        type: String,
        default: uuidv4,
        hashKey:true,
    },
    userEmail: {
      type: String,
      required:true,
    },
    userName: {
        type: String,
      },
    rating: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
    createdOn: {
      type: String,
      default: () => new Date().toISOString(), // Use Date.now as default value
    },
  }
);

const ReviewModel = dynamoose.model('Review', reviewSchema, { tableName: 'siddha_review' }); 

export { ReviewModel };
