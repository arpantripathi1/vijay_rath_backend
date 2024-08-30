// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    amount: {type: Number, required: true },
    currency: { type: String, required: true  },
    receipt: { type: String, required: true  },
    status: { type: String, required: true  },
    plan: { type: String, required: true  },
    customer: {
        name: { type: String,     required: true },
        role: { type: String, required: true },
        collegeName: {    
                type: String,
                required: function() {
                return this.customer.role === 'student';
            }
        },
        collegeCity: {     
                type: String,
                required: function() {
                return this.customer.role === 'student';
            }
        },
        collegeState: {    
                type: String, 
                required: function() {
                return this.customer.role === 'student';
            }
        },
        email: { type: String, required: true},
        phone: { type: String, required: false }
    }
});

module.exports = mongoose.model('Order', OrderSchema);
