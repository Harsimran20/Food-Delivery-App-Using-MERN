import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const frontend_url = "http://localhost:5173"; // Change this to your deployed frontend URL

// Place Order Without Payment
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Validate request data
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Create a new order in MongoDB
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            status: "Confirmed", // Order confirmed without payment
        });
        await newOrder.save();

        // Clear user's cart after order placement
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({
            success: true,
            orderId: newOrder._id,
            message: "Order placed successfully without payment",
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { placeOrder };
