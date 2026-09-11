import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import connectDB from "../server/configs/db.js";
import 'dotenv/config';
import userRouter from "../server/routes/userRoute.js";
import sellerRouter from "../server/routes/sellerRoute.js";
import connectCloudinary from "../server/configs/cloudinary.js";
import productRouter from "../server/routes/productRoute.js";
import cartRouter from "../server/routes/cartRoute.js";
import addressRouter from "../server/routes/addressRoute.js";
import orderRouter from "../server/routes/orderRoute.js";
//import { stripeWebhooks } from "../server/controllers/orederController.js";

const app = express();

// Connect DB and Cloudinary (Move to request time or use a connection flag)
let isConnected = false;
const connectServices = async () => {
  if (!isConnected) {
    await connectDB();
    await connectCloudinary();
    isConnected = true;
  }
};

// Stripe webhook (must come before bodyParser middleware)
//app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173', 'https://your-frontend.vercel.app'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/api', (req, res) => res.status(200).send('API is working ✅'));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Export as Vercel Serverless Function
export default async function handler(req, res) {
  await connectServices(); // Ensure DB & Cloudinary are connected
  return app(req, res);    // Pass the request to Express
}
