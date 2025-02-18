import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ 
        name: String, 
        price: Number, 
        quantity: Number 
    }],
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
