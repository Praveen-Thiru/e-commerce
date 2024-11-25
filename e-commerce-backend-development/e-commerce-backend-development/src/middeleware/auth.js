import jsonwebtoken from 'jsonwebtoken';

const verifyJWTToken = (req, res, next) => {
  try {
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({
        status: false,
        message: 'Invalid token or expired!',
        data: null,
      });
    } else {
      jsonwebtoken.verify(token, process.env.SECRET||'quantumsharq', async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            status: 401,
            message: 'You are Not Authorized',
          });
        } else {
          if (result) {
            req.body.user = result;
            return next();
          } else {
            return res.status(401).json({
              status: 401,
              message: 'Invalid token or expired!',
            });
          }
        }
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: 'Invalid token or expired!',
      data: null,
    });
  }
};

export default verifyJWTToken;
