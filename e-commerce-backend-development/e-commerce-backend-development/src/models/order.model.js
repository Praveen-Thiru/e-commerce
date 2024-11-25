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


// Define the schema for product details
const productDetailsSchema = new dynamoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  imageUrl:{
    type: String
  }

});



// Define the schema for orders
const orderSchema = new dynamoose.Schema({
  orderId: {
    type: String,
    hashKey: true, // Primary key
    default: uuidv4
  },
  userEmail: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
  address: {
    type: Array,
    schema: [addressSchema]
  },
  products: {
    type: Array,
    schema: [productDetailsSchema],
    required: true,
  },
  trackingDetails: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [
      'PLACED',
      'SHIPED',
      'DELIVERIED',
      'CANCELED'
    ],
    default: 'PLACED',
  },
  deliveryFrom:{
    type: String
  },
  deliveryTo:{
    type: String
  },
  deliveryDate:{
    type: String
  },
  paymentMethod:{
    type: String
  },
  createdOn: {
    type: String, // Define `createdOn` as Date type
    default: () => new Date().toISOString(), // Use Date.now as default value
  }

})

// Create the model for orders
const OrderModel = dynamoose.model('order', orderSchema, { tableName: 'siddha_order' });

export { OrderModel };
