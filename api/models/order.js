const mongoose = require('mongoose');


const orderSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId,ref:'Product'},
    quantity: { type: Number, default: 1}
});

let Order = mongoose.model('Order',orderSchema);
module.exports = Order;