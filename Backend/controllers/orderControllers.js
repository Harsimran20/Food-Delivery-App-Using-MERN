import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const frontend_url = "http://localhost:5173"; // Change this to your deployed frontend URL

// Place Order and Generate Razorpay Order
const placeOrder = async (req, res) => {
    try {
        // Create a new order in MongoDB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: "Pending", // Default status before payment
        });
        await newOrder.save();

        // Clear user's cart after order placement
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Convert items to Razorpay format
        const totalAmount = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2; // Adding Delivery Charges
        const amountInPaise = totalAmount * 100; // Razorpay accepts amount in paise

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `order_rcptid_${newOrder._id}`,
            payment_capture: 1, // Auto-capture payment
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save Razorpay order ID to the database
        newOrder.razorpayOrderId = razorpayOrder.id;
        await newOrder.save();

        res.json({
            success: true,
            orderId: newOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID, // Send key to frontend
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error in placing order" });
    }
};

// Verify Payment Signature & Update Order Status
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            await orderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Paid", paymentId: razorpay_payment_id }
            );
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};


export { placeOrder, verifyPayment };

