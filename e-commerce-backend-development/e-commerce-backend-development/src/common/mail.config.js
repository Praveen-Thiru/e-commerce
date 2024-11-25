import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
    user: 'koushik3dto2y@gmail.com',
    pass: 'xgxt pwoe iqrb aztn',
  },
});

const mailObj = async data => {
  return {
    from: process.env.FROM_MAIL,
    to: data.mailto,
    subject: data.subject,
    text: data.content,
  };
};

export { transporter, mailObj };
