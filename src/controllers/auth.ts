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
      422,
      errorMessages
    );

    return next(error);
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

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new HttpError(
        'A user with this email could not be found!',
        401
      );

      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new HttpError('Wrong Password', 401);
      return next(error);
    }
  } catch (err) {
    handleError(err, req, res, next);
  }
};
