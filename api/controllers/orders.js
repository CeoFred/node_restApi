const Order = require('../models/order');
const Product = require('../models/products');
const mongoose = require('mongoose');

exports.orders_get_all =  (req,res,next) =>{

    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    // populate helps relate our products
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
               return{
                _id: doc.id,
                product: doc.product,
                quantity: doc.quantity,
                request: {
                    type: 'GET',
                    url : 'http://localhost:3000/orders/'+ doc._id
                }
               } 
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.orders_create = (req,res,next) =>{
        Product.findById(req.body.productId)
            .exec()
            .then(product => {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
             return  order.save()          
        })
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Order Stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+ result._id
                }
            })
        })
        .catch(err => {
            res.status(404).json({
                message: "productID not found",
                error: err
            });
        })
}

exports.orders_get_single = (req,res,next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        res.status(200).json({
            orderSummary: order,
            request: {
                type:'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(404).json({
            messgae: err
        })
    })
}

exports.orders_delete = (req,res,next) => {
   
    Order.deleteOne({_id:req.params.orderId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'order deleted',
            result: result
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
};