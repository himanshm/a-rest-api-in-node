import { Request, Response, NextFunction } from 'express';

class HttpError extends Error {
  httpErrorCode: number;

  constructor(message: string, httpErrorCode: number) {
    super(message); // Call the constructor of the base Error class.
    this.httpErrorCode = httpErrorCode;
    this.name = this.constructor.name; // Set the error name to the class name.
  }
}

export const handleError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    if (!err.httpErrorCode) {
      err.httpErrorCode = 500;
    }
    next(err);
  } else if (err instanceof Error) {
    const httpError = new HttpError(err.message, 500);
    next(httpError);
  } else {
    // Handle cases where err might not be an Error object at all
    const unknownError = new HttpError('An unknown error occurred', 500);
    next(unknownError);
  }
};

export default HttpError;
