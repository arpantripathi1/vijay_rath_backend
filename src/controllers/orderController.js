require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Ensure you import crypto module
const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

         // Validate request body
         const { plan, amount, currency, receipt, customer } = req.body;

         // Check if required fields are present
         if (!plan || !amount || !currency || !receipt || !customer || !customer.name || !customer.role || !customer.email) {
             return res.status(400).send("Bad Request: Missing required fields");
         }

         // Create Razorpay order
        const options = {
            amount: amount, // Amount in paise
            currency: currency,
            receipt: receipt
        };

        // const options = req.body;
        const order = await razorpay.orders.create(options);

       // Check if the order was created successfully
       if (!order) {
        return res.status(400).send("Bad Request: Razorpay order creation failed");
       }

         // Save the order in the database
         const newOrder = new Order({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            plan: plan,
            customer: customer
        });

        await newOrder.save();

        // Respond with the created order data
        res.json(order);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};


// const validatePayment = async (req, res) => {
//     const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

//     const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const digest = sha.digest("hex");

//     if (digest !== razorpay_signature) {
//         return res.status(400).json({msg: "Transaction is not legit!"});
//     }

//     res.json({msg: "Transaction is legit!", orderId: razorpay_order_id, paymentId: razorpay_payment_id});
// };


const validatePayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    // Check if the signature is valid
    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    try {
        // Update the order status in the database
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: razorpay_order_id },
            { status: 'paid' }, // Update status as needed
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ msg: "Order not found!" });
        }

        // Respond with payment confirmation
        res.json({
            msg: "Transaction is legit!",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            orderDetails: updatedOrder
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};



module.exports = { createOrder, validatePayment };
