import express, {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import multer, { FileFilterCallback } from 'multer';

import { mongooseConnect } from '../config/database';
import feedRoutes from './routes/feed';
import authRoutes from './routes/auth';
import path from 'path';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app: Express = express();

const port = process.env.PORT;

if (!port) {
  throw new Error('No Connection port is provided!');
}
console.log(port);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images'));
  },
  filename: (req, file, cb) => {
    // Replace colons (:) from the ISO string as they're not valid in filenames on some systems
    const timestamp = new Date().toISOString().replace('/:/g', '-');
    const uniqueSuffix = `${timestamp}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

type MulterFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void;

const fileFilter: MulterFileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded  <form></form>
app.use(bodyParser.json()); // application/json
// Register multer for handling file uploads
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
// Serving images from public/images
app.use(
  '/images',
  express.static(path.join(__dirname, '..', 'public', 'images'))
);

// Setup response headers to get rid of CORS errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err); // Log the error for server-side debugging

  const statusCode = err.statusCode || 500; // Default to 500 if statusCode not specified
  const message = err.message;
  const data = err.data;
  res.status(statusCode).json({ message, data });
};

app.use(errorHandler);

// Server Initialization
async function initialize() {
  try {
    await mongooseConnect();

    app.listen(port);
    console.log(`Server is listening on port ${port}`);
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
