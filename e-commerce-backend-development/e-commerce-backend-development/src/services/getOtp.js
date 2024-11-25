import { sendResponse } from '../common/common.js';
import { mailObj, transporter } from '../common/mail.config.js';
import { CODES } from '../common/response-code.js';
import bcrypt from 'bcryptjs';

export default class GetOtpService {
  #userConnection;

  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  getOtp = async (req) => {
    try {
      const { email } = req.params
      const user = await this.#userConnection.get(email);
      if (!user) return sendResponse(CODES.BAD_REQUEST, 'User Not Found');

      let otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp;
      user.expireTime = Date.now() + 15 * 60 * 1000;
      await user.save();

      await transporter.sendMail(
        await mailObj({
          subject: 'OTP to reset Password',
          content: `Use this OTP to reset the password: ${otp}`,
          mailto: user.email
        })
      );

      
      return sendResponse(CODES.OK, 'OTP sent');
    } catch (error) {
      console.error('Error in getting OTP:', error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in send OTP');
    }
  };

  verifyOtp = async req => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return sendResponse(CODES.BAD_REQUEST, 'Please Enter OTP and Mail');
      }

      const user = await this.#userConnection.scan({
              email: { eq: email },
              otp: { eq: otp },
              expireTime: { gt: Date.now() }
            }).exec();
      if (user.length === 0) {
        return sendResponse(CODES.BAD_REQUEST, 'Invalid OTP or OTP has expired');
      }

      return sendResponse(CODES.OK, 'OTP Verified Successfully!');
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Verify OTP');
    }
  };

  changePassword = async req => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return sendResponse(CODES.BAD_REQUEST, 'Please Enter email');
      }

      const user = await this.#userConnection.get({email});
      
      if (!user) {
        return sendResponse(CODES.NOT_FOUND, 'User not Found');
      }

      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);

      await this.#userConnection.update({ email }, {
        otp: 0,
        expireTime: 0,
        password: hashpassword
      });
      return sendResponse(CODES.OK, 'OTP Verified and New Password has been Set Successfully!');
    } catch (error) {
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in change Password.');
    }
  };

  
}
