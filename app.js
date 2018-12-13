const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb://localhost/test',{
    useNewUrlParser:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection noticed an error:'));
db.once('open',() =>{
console.log('Connected');
});

mongoose.Promise = global.Promise;
// app.use((req,res,next) => {
// //use sets up a middleware. Incoming request has to go through use
// res.status(200).json({
//       message: "It works"
//     }); 
// });

//making the uploads folder available to the pubic,targets request coming throught the uploads url path /uploads
app.use('/uploads',express.static('uploads'));

// morgan helps to concole.log our request
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// allowing CORS Cross Origin Request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Contorl-Allow-Headers','*');

    if(req.method === 'OPTIONS'){
        // HTTP METHODS TO BE SUPPORTED
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({

    });
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

// middleware for errors
app.use((req,res,next) => {
        const error = new Error('Not found');
        error.status = 400;
        next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;