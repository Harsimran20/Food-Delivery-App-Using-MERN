import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder,userOrders } from "../controllers/orderControllers.js";

const router = express.Router();

// Route to place an order without payment
orderRouter.post("/place-order", placeOrder);
orderRouter.post("/userorders",authMiddleware,userOrders)
export default orderRouter;

