const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
//const cookieParser=require('cookie-parser');

//app.use(cookieParser());

let verificaToken=(req,res,next)=>{
    // check header for the token
    //var token = req.headers['access-token'];
    // let token=req.cookies.access_token;
    //Fernando Herrera
    let token = req.get('access_token');
  
    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        if(err){
            return res.status(400).json({
                err
            });
        }
        console.log(decoded);

        req.user=decoded.user;
        next();
    });

};

module.exports={verificaToken}