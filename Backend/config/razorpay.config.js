const razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
const createRazorpayInstance=()=>{
    return new razorpay({
        key_id: process.env.rzp_test_HWICyOc6m6n9Zp,
        key_secret: process.env.TP7vk1vusHQzNq6nJgGYyTrU
    });
}
module.exports = razorpay;