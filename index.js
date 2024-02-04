import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AdministrationRouter from './router/AdministrationRouter.js';
import Clientrouter from './router/ClientRouter.js';
import CalculationsRouter from './router/CalculationsRouter.js';
import OrdersRouter from './router/OrdersRouter.js';

dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:3000',
  ]
}));

app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DB Start");
  });

  app.use('/api',AdministrationRouter);
  app.use('/api',Clientrouter);
  app.use('/api',CalculationsRouter);
  app.use('/api',OrdersRouter);

  app.listen(process.env.PORT, () => {
    console.log('server start', process.env.PORT);
  });