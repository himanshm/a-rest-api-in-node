import express, { Express } from 'express';

import feedRoutes from './routes/feed';

const app: Express = express();

app.use('/feed', feedRoutes);

app.listen(8080);
