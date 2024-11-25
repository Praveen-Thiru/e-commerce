import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const blogSchema = new dynamoose.Schema(
  {
    blogId:{
        type: String,
        default: uuidv4,
        hashKey:true,
    },
    title: {
      type: String,
      required:true,
    },
    category: {
      type: String,
    },
    description: {
        type: String,
      },
    imageUrl: {
      type: String,
    },
    link:{
      type: String,
    },
    createdOn: {
      type: String,
      default: () => new Date().toISOString(), // Use Date.now as default value
    },
  }
);

const BlogModel = dynamoose.model('Review', blogSchema, { tableName: 'siddha_blog' }); 

export { BlogModel };
