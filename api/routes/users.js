const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');


router.post('/login',(req,res,next) => {
User.find({ email: req.body.email })
    .exec()
    .then(user => {
    if(user.length < 1){
        return res.status(401).json({
            message:"Auth Failed"
        });
    }else{
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
            // res == true
            if(err){
                return res.status(401).json({
                    message:"Auth Failed"
                });
            }
            if(result){

                const token = jwt.sign({
                     email: user[0].email, 
                     userId: user[0]._id
                    },
                     process.env.JWT_SECRET_KEY,
                     {
                         expiresIn:"1h"
                     });
                 req.headers.authorization = 'Bearer '+ token;
                return res.status(200).json({
                    message:"Auth Successfull",
                    token: token
                })
            }
            return res.status(401).json({
                message:"Auth Failed"
            });

        });}
})
.catch(err => {
    console.log(err)
})
});
router.post('/signup', (req,res,next) => {
    User.find({email:req.body.email}).exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message:"email already exists",
            
            })
        }else{
            
    bcrypt.hash(req.body.password,10,(err,hash) => {
        if(err){
            res.status(500).json({
                error: err
                    });
                }else{
                    
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
                });
                user.save()
                .then(result => {
                            res.status(200).json({
                                message:"User successfully SignedUp",
                                data: result
                            });
                })
                .catch(err => {
                    res.status(500).header('Error:True').json({
                        message:err
                    });
                })
            }       
        });

        }
    })
    .catch(err => {
        res.status(500).json({
            message:err
        })
    });

});

router.delete('/:userId',(req,res,next) =>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(201).header('Validated:True').json({
            message:"User deleted",
            data: result
        })
    })
    .catch(err => {
        res.status(500).json({
            message:err
        });
    });
})

module.exports = router;