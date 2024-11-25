import dynamoose from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

const appointmentSchema = new dynamoose.Schema(
  {
    appointmentId:{
        type: String,
        default: uuidv4,
        hashKey:true,
    },
    userEmail: {
      type: String,
      required:true,
    },
    name: {
      type: String,
      required:true,
    },
    email: {
      type: String,
    },
    mobile: {
        type: Number,
      },
    DOB: {
      type: String,
    },
    gender: {
        type: String,
    },
    reason: {
        type: String,
    },
    mode: {
        type: String,
    },
    address: {
        type: String,
    },
    category: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    createdOn: {
      type: String,
      default: () => new Date().toISOString(), // Use Date.now as default value
    },
  }
);

const AppointmentModel = dynamoose.model('Appointment', appointmentSchema, { tableName: 'siddha_appointment' }); 

export { AppointmentModel };
