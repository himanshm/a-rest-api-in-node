import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/user';
import HttpError from '../../utils/htttpError';

export const signup: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    const error = new HttpError(
      'Validation Failed! Entered data is incorrect!',
      422
    );
    errorMessages;

    throw error;
  }
  const { email, password, name } = req.body;
};
