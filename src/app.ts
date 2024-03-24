import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import feedRoutes from './routes/feed';

const app: Express = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded  <form></form>
app.use(bodyParser.json()); // application/json

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

app.listen(8080);
