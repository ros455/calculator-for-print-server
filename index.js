import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

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

  app.listen(process.env.PORT, () => {
    console.log('server start', process.env.PORT);
  });