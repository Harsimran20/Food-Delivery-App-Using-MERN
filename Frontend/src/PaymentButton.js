import React from "react";

const PaymentButton = ({ amount }) => {
  const handlePayment = async () => {
    const response = await fetch("http://localhost:5000/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const order = await response.json();

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: order.amount,
      currency: order.currency,
      name: "Food Delivery App",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        // Send response to backend for verification
        const verifyResponse = await fetch("http://localhost:3000/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          alert("Payment successful!");
        } else {
          alert("Payment verification failed!");
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return <button onClick={handlePayment}>Pay ₹{amount}</button>;
};

export default PaymentButton;
