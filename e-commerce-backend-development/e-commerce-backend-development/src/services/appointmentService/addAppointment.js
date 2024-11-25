import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';
import { mailObj, transporter } from '../../common/mail.config.js';


export default class AddAppointmentService {
  #appointModel;
  constructor(appointModel) {
    this.#appointModel = appointModel;
  }


    bookAppointment = async req => {
        try {
            logger.info('Inside createOne method');
            const newData = req.body; // Expecting an object with fields to save
            
            
    
            // Validate the input
            if (Object.keys(newData).length === 0) 
                return sendResponse(CODES.BAD_REQUEST, 'Provide data to save');

            newData.userEmail = newData.user?.email
            console.log(newData);
    
            // Save the new item
            const savedData = await this.#appointModel.create(newData); // Adjust according to your ORM/model method

            await transporter.sendMail(
                await mailObj({
                  subject: 'Your Appointment Booked',
                  content: `Dear ${newData.name},

Your appointment at Veerababu Hospital is Booked Successfully!

Details:

  Date: ${newData.date}
  Time: ${newData.time}

Please arrive at least 15 Minutes early. For any changes, contact us at 7200092381.

Thank you for choosing Veerababu Hospital. We look forward to seeing you!

Best regards,
Veerababu Hospital Team`,
                  mailto: newData.email
                })
              );
            return sendResponse(CODES.CREATED, 'Item saved successfully', savedData);
    
        } catch (error) {
            logger.error(`Error in save new data API: ${error.message}`);
            return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in save API');
        }
    }
}