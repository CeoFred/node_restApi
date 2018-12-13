
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const checkAuth = require('../middleware/check_Auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+ file.originalname)
    }
  })

  function fileFilter (req, file, cb) {
if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    // To accept the file pass `true`, like so:
 return   cb(null, true);
}
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
  
    // To reject this file pass `false`, like so:
    cb(null, false);
    // You can always pass an error if something goes wrong:
      cb(new Error('Image should be of type jpeg or png!'))
  
  }

const upload = multer({ 
    fileFilter: fileFilter,
    storage: storage ,limits:{
    fileSize: 1024 * 1024 * 5
}});

const Product = require('../models/products');

router.get('/', (req,res,next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        // if(docs.length >= 0){
            // console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        productImage: doc.productImage,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                }) 
            };
            res.status(200).json(response);
        // }else{
        // res.status(404).end('Null');
        // }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err
        })
    })


});
router.get('/view', (req,res,next) => {
    console.log(req.headers);
    console.log(req.ip);
    
    Product.find()
    .exec()
   .then(data => {
       res.status(200).json(data);
       data.forEach(element => {
           console.log(`${element.name} is the Name of our product while ${element.price} is the price`);
       });
   })
   .catch(err => {
console.log(err)
res.status(500).json({
    error: err
})
   });
   

});


router.post('/',checkAuth,upload.single('productImage') ,(req,res,next) => {

   console.log(req.file);
    let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    console.log(product);    
    product
   .save()
   .then((data) => {

console.log('Success '+ data);
res.status(200).json({
    message: "created product",
    newProduct: {
        name: data.name,
        price: data.price,
        id: data._id,
        url:req.originalUrl+''+data._id
    }
});
   })
   .catch(err => {
       console.log(err);
res.status(500).json({message: err});

   })

});

router.get('/:productId',(req,res,next)=>{

    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type: 'GET'
                }
            });
            console.log('Success '+ doc);

        }
    })
    .catch(err => {
        console.log('Failed: ' + err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:productId',checkAuth,(req,res,next)=>{

    const id = req.params.productId;
    const updateOps = {};
    console.log(req.body);
    for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
    console.log(updateOps);

    Product.update({_id : id},{$set:updateOps})
            .exec()
           .then(data => {
    res.status(200).json({
        message: 'product Upated',
        request: {
            type: 'GET',
            url: 'http://localhost:3000/products/'+id
        }
    });
    })
        .catch(err => {
    console.log(err)
    res.status(500).json({
        message:err});
    })

});


router.delete('/:productId',checkAuth,(req,res,next)=>{
    let id = req.params.productId
    Product.deleteOne({_id:id}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type:'POST',
                url: 'http://localhost:3000/product',
                body: {
                    name: String,
                    price: Number
                }
            }
        });    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: err
        })
    })
});
module.exports = router;