const jwt = require('jsonwebtoken');

module.exports = (req,res,next)  =>{

    //check if an authtorization headeer exixsts
    const token = req.headers.authorization.split(" ")[1];
try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.userData = decoded; 
}catch(err){
    return res.status(404).json({
        message:"Auth Failed"
    })
}

next();

}