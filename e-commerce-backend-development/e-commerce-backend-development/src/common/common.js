import crypto from 'crypto';


const sendResponse = (statuscode, message, additionalArgs = {}) => {
  const response = {
    status: statuscode,
    message: message,
    ...additionalArgs,
  };

  return response;
};

const encrypt = async password => {
  const algorithm = 'aes-256-cbc';
  const cipher = crypto.Cipher(algorithm, process.env.SECRET);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = async password => {
  const algorithm = 'aes-256-cbc';
  const decipher = crypto.Decipher(algorithm, process.env.SECRET);
  let decrypted = decipher.update(password, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export { sendResponse, encrypt, decrypt };
