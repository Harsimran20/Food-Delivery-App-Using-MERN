import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder,userOrders } from "../controllers/orderControllers.js";

const router = express.Router();
const authMiddleware = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      req.user = decoded; // Attach user data to request
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
// Route to place an order without payment
router.post("/place-order", authMiddleware,placeOrder);
router.post("/verify",verifyOrder);
router.post("/userorders",authMiddleware,userOrders)

export default router;

