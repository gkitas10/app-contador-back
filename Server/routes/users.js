const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const User=require('../models/user');
const jwt=require('jsonwebtoken');

app.post('/signup',(req,res)=>{
    let body=req.body;

    let user=new User({
        name:body.name,
        email:body.email,
        password:bcrypt.hashSync(body.password,10)
        
    });

    user.save((err,userDB)=>{
        if(err){
           return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!userDB)
        return res.status(404).json({ok:false,errMessage:'No se ha podido crear el usuario'});

        res.json({
            ok:true,
            user:userDB,
        });
    });
});

app.post('/login',(req,res)=>{

    let body=req.body;

    User.findOne({email:body.email},(err,userDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!userDB){
            return res.status(400).json({
                ok:false,
                err:{message:'(user) or password are incorrect'}
            });
        }

        if(!bcrypt.compareSync(body.password,userDB.password)){
            return res.status(400).json({
                ok:false,
                err:{message:'user or (password) are incorrect'}
            });
        }

        let token=jwt.sign({user:userDB},process.env.SEED,{expiresIn:60*60}); 

       
        const dataUser={
            id:userDB.id,
            email:userDB.email,
            access_token:token,
            expiresIn:'3600'
        }
        
        res.json({
            dataUser
        })
    });
});



module.exports=app;