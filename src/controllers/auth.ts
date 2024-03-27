import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import User from '../models/user';
import HttpError from '../../utils/htttpError';
import { handleError } from '../../utils/htttpError';

export const signup: RequestHandler = async (req, res, next) => {
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
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    handleError(err, req, res, next);
  }
};
