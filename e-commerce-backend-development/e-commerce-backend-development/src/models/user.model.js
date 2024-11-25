import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const addressSchema = new dynamoose.Schema(
  {
    id:{
      type:String,
      default: uuidv4,
    },
    name: {
      type: String,
      
    },
    phoneNo: {
      type: String,
      
    },
    houseNo: {
      type: String,
      
    },
    streetName: {
      type: String,
      
    },
    city: {
      type: String,
      
    },
    pincode: {
      type: String,
      
    },
    addressType: {
      type: String,
      enum: ['home', 'office'], // Only allow specific types
    },
  }
);

const cartSchema = new dynamoose.Schema(
  {
    productId:{
      type: String,
    },
    
    quantity:{
      type: Number,
      default: 1
    }
  }
)

const userSchema = new dynamoose.Schema(
  {
    name: {
      type: String,
    
    },
    mobile: {
      type: Number,
      
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      hashKey:true,
    },
    address: {
      type: Array,
      schema: [addressSchema],
      default:[]
    },
    wishlist: {
      type: Array,
      schema: [String], // Array of product IDs
      default: []
    },
    wrongPasswordCount: {
      type: Number,
      default: 0,
    },
    lockedTemp: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    expireTime: {
      type: Number,
    },
    cart:{
      type: Array,
      schema: [cartSchema],
      default: []
    },
    role:{
      type: String,
      enum:['User', 'Admin'],
      default:'User'
    },
    createdOn: {
      type: String,
      default: () => new Date().toISOString(), // Use Date.now as default value
    },
  },
  { autoCreate: false }
);

const userModel = dynamoose.model('User', userSchema, { tableName: 'siddha_user' }); 

export { userModel };
