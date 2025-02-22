import express from "express";
import { placeOrder } from "../controllers/orderControllers.js";

const router = express.Router();

// Route to place an order without payment
router.post("/place-order", placeOrder);

export default router;

