const express = require('express');
const { createOrder,validatePayment } = require('../controllers/orderController');
const router = express.Router();

router.post('/order', createOrder);
router.post("/validate", validatePayment);

module.exports = router;