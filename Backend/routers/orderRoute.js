import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder,userOrders } from "../controllers/orderControllers.js";

const router = express.Router();

// Route to place an order without payment
router.post("/place-order", authMiddleware,placeOrder);
router.post("/verify",verifyOrder);
router.post("/userorders",authMiddleware,userOrders)

export default router;

