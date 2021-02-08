const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/user');
const jwt=require('jsonwebtoken');
var admin = require('firebase-admin');
const { findOne } = require('../models/user');

exports.signUp = ( req, res ) => {
    let body = req.body;
    console.log('body', body)
    let user = new User({
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
};

exports.logIn = ( req, res ) => {
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

        let token=jwt.sign({user:userDB},process.env.SEED,{expiresIn:+process.env.CADUCIDAD_TOKEN}); 

        const dataUser={
            id:userDB.id,
            email:userDB.email,
            access_token:token,
            expiresIn:process.env.CADUCIDAD_TOKEN
        }
        
        res.json({
            dataUser
        })
    });
};

exports.googleSignIn = async (req, res, next) => {
    const { idToken, FireUser } = req.body;
    try {
        await admin.auth().verifyIdToken(idToken, true)
        const userDB = await User.findOne({
            email:FireUser.email
        })

        if(userDB) {
            if (userDB.google === false) {
                throw createError(401, 'Inicia sesión con tu cuenta de correo y password')
            } else {
                const token = jwt.sign({
                    user: userDB
                    //turn global var CADUCIDAD_TOKEN into number again because global variables turn into strings
                }, process.env.SEED, {expiresIn:+process.env.CADUCIDAD_TOKEN});

                const dataUser={
                    id:userDB.id,
                    email:userDB.email,
                    access_token:token,
                    expiresIn:process.env.CADUCIDAD_TOKEN
                }

                return res.json({
                    dataUser
                });
            }
        }else {
           // Si el usuario no existe en nuestra base de datos
            let user = new User();

            user.name = FireUser.displayName;
            user.email = FireUser.email;
            user.password = ':)';
            user.img = FireUser.photoURL;
            user.google = true;
        
            try {
                const userDB = await user.save()
                if(!userDB) {
                    throw createError(404, 'No se ha podido crear el usuario')
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {expiresIn:+process.env.CADUCIDAD_TOKEN});

                const dataUser = {
                    id:userDB.id,
                    email:userDB.email,
                    access_token:token,
                    expiresIn:process.env.CADUCIDAD_TOKEN
                }

                res.json({
                    dataUser
                });

            } catch (error) {
                next(error)
            }
        }

    } catch (error) {
        if (error.code == 'auth/id-token-revoked') {
            // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            next(error)
            
          } else {
            // Token is invalid.
            next(error)
          }
    }
}
