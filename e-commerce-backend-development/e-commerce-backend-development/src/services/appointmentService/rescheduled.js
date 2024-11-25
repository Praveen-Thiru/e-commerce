import { sendResponse } from '../../common/common.js';
import { CODES } from '../../common/response-code.js';
import { logger } from '../../logger/logger.js';
import { mailObj, transporter } from '../../common/mail.config.js';

export default class RescheduleAppointmentService {
  #appointModel;
  constructor(appointModel) {
    this.#appointModel = appointModel;
  }

  rescheduleAppointment = async req => {
    try {
      logger.info('Inside rescheduleAppointment method');
      const { appointmentId, newDate, newTime } = req.body; // Expecting these fields

      // Validate the input
      if (!appointmentId || !newDate || !newTime) {
        return sendResponse(CODES.BAD_REQUEST, 'Provide appointmentId, newDate, and newTime to reschedule');
      }

      // Find the existing appointment
      const existingAppointment = await this.#appointModel.get(appointmentId); 
      if (!existingAppointment) {
        return sendResponse(CODES.NOT_FOUND, 'Appointment not found');
      }

      // Update the appointment with new details
      existingAppointment.date = newDate;
      existingAppointment.time = newTime;

      const updatedData = await existingAppointment.save(); 

      // Send confirmation email
      await transporter.sendMail(
        await mailObj({
          subject: 'Your Appointment Rescheduled',
          content: `Dear ${ existingAppointment.name},

Your appointment at Veerababu Hospital has been rescheduled successfully!

New Details:

  Date: ${newDate}
  Time: ${newTime}

Please arrive at least 15 Minutes early. For any changes, contact us at 7200092381.

Thank you for choosing Veerababu Hospital. We look forward to seeing you!

Best regards,
Veerababu Hospital Team`,
          mailto: existingAppointment.email
        })
      );

      return sendResponse(CODES.OK, 'Appointment rescheduled successfully', updatedData);

    } catch (error) {
      logger.error(`Error in reschedule appointment API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in rescheduling appointment');
    }
  }
}
