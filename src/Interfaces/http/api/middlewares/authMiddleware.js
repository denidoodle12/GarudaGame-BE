import jwt from 'jsonwebtoken';
import config from '../../../../Commons/config.js';
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AuthenticationError('Missing authentication'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.auth.accessTokenKey);
    req.auth = {
      credentials: {
        id: decoded.id,
      },
    };
    next();
  } catch (error) {
    return next(new AuthenticationError('Token tidak valid'));
  }
};

export default authMiddleware;
