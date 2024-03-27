import { RequestHandler } from 'express';
import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

import HttpError, { handleError } from '../utils/htttpError';

const privateKey = process.env.JWT_SECRET_KEY;
if (!privateKey) {
  throw new Error('No Private key exists');
}

const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    // Handle the case where the Authorization header is missing
    throw new HttpError('Not authenticated.', 401);
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: string | JwtPayload;
  try {
    decodedToken = jwt.verify(token, privateKey);

    if (typeof decodedToken === 'object' && 'userId' in decodedToken) {
      req.userId = decodedToken.userId; // Make sure your token actually includes userId
      return next();
    }

    throw new HttpError('Not Authenticated', 401);
  } catch (err) {
    handleError(err, req, res, next);
  }
};

export default isAuth;
