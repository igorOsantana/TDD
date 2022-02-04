import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3030,
};
