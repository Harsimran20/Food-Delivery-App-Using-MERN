import React from "react";
import axios from "axios";

const Payment = ({ orderId }) => {
    const handlePayment = async () => {
        try {
            const { data } = await axios.post("http://localhost:5173/api/order/place", {
                userId: "USER_ID", // Replace with logged-in user ID
                items: [
                    { name: "Item 1", price: 100, quantity: 1 },
                    { name: "Item 2", price: 200, quantity: 2 },
                ],
                amount: 500, // Total amount
                address: "123 Street, City"
            });

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Your Shop Name",
                description: "Order Payment",
                order_id: data.razorpayOrderId,
                handler: async (response) => {
                    // Verify Payment on Backend
                    const verifyRes = await axios.post("http://localhost:5000/api/order/verify", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.data.success) {
                        alert("Payment Successful!");
                    } else {
                        alert("Payment Verification Failed!");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#528FF0" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed!");
        }
    };

    return (
        <div>
            <h2>Proceed to Payment</h2>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
