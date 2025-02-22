import React, { useEffect, useState } from "react";

const OrderDetails = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!orderId) {
                    setError("Order ID is required.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5173/orders/${orderId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch order details");
                }

                const data = await response.json();

                if (data.success) {
                    setOrder(data.order);
                } else {
                    throw new Error(data.message || "Error fetching order");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <p>Loading order details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> {order?._id}</p>
            <p><strong>User Name:</strong> {order?.userId?.name || "N/A"}</p>
            <p><strong>Email:</strong> {order?.userId?.email || "N/A"}</p>
            <p><strong>Status:</strong> {order?.status || "N/A"}</p>
            <p><strong>Total Amount:</strong> ${order?.amount || "0.00"}</p>
            <h3>Items Ordered:</h3>
            <ul>
                {order?.items?.length > 0 ? (
                    order.items.map((item, index) => (
                        <li key={index}>
                            {item.name} - {item.quantity} x ${item.price}
                        </li>
                    ))
                ) : (
                    <p>No items found.</p>
                )}
            </ul>
        </div>
    );
};

export default OrderDetails;


