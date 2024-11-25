import jsonwebtoken from 'jsonwebtoken';
import { logger } from '../logger/logger.js';
//if we don't give algorithm field, by default it will be taking HS256
const generateAccessToken = async data => {
  return jsonwebtoken.sign(data, process.env.SECRET || 'quantumsharq', {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

const generateRefreshToken = async data => {
  return jsonwebtoken.sign(data, process.env.SECRET, {
    expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRE,
  });
};

const authenticateJWT = async (req, res, next) => {
  logger.info('Authenticating...');
  const authHeader = req.headers.authorization;

  if (authHeader) {
    logger.info(`Auth Header : ${JSON.stringify(authHeader)}`);
    const token = authHeader.split(' ')[1] || authHeader;
    jwtVerify(token, process.env.SECRET || 'quantumsharq', authHeader, req, res, next).then();
  } else {
    logger.info('Unauthorized : Missing Authorization Header');
    res.status(401).json('Unauthorized : Missing Authorization Header');
  }
};

const jwtVerify = async (token, publickey, authHeader, req, res, next) => {
  jsonwebtoken.verify(token, publickey, (err, user) => {
    if (err) {
      logger.error(`Error: ${err}`);
      return res.status(403).json('Session expired');
    }

    logger.info('Authenticated Successfully');
    logger.info(`User details: ${JSON.stringify(user)}`);

    req.user = user;
    req.usertoken = token;
    next();
  });
};

export { generateAccessToken, generateRefreshToken, authenticateJWT };
