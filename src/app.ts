import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { mongooseConnect } from '../config/database';
import feedRoutes from './routes/feed';

const app: Express = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded  <form></form>
app.use(bodyParser.json()); // application/json

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

// Server Initialization
async function initialize() {
  try {
    await mongooseConnect();

    app.listen(3000);
    console.log('Server is listening on port 3000.');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

initialize();
