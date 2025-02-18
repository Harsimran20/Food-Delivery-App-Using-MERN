import { useState, useEffect } from "react";
import axios from "axios";

const Checkout = ({ cart, user }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Dynamically load the Razorpay script to ensure availability
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => console.log("Razorpay script loaded");
        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        if (!window.Razorpay) {
            alert("Razorpay SDK not loaded. Please refresh the page and try again.");
            return;
        }

        setLoading(true);
        try {
            // Send order details to the backend
            const { data } = await axios.post("http://localhost:5000/api/orders/place-order", {
                userId: user._id,
                items: cart,
                amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 2, // Add delivery charges
                address: user.address,
            });

            // Load Razorpay Checkout
            const options = {
                key: data.key, // Razorpay API Key
                amount: data.amount,
                currency: "INR",
                name: "Food Delivery App",
                description: "Order Payment",
                order_id: data.razorpayOrderId,
                handler: async (response) => {
                    try {
                        // Send payment details to backend for verification
                        const verifyRes = await axios.post("http://localhost:5000/api/orders/verify-payment", response);
                        alert(verifyRes.data?.message || "Payment verified successfully!");
                    } catch (err) {
                        console.error("Error verifying payment:", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone,
                },
                theme: {
                    color: "#f37251",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment initiation error:", error);
            alert("Payment failed! Please try again.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Checkout</h2>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </div>
    );
};

export default Checkout;



