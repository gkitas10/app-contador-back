const express=require('express');
const app=express();
const Ticket=require('../models/ticket');
const {verificaToken}=require('../middlewares/auth');
//const cookieParser=require('cookie-parser');

//app.use(cookieParser());

app.post('/save-ticket',verificaToken,(req,res)=>{
    let body=req.body;

    let ticket=new Ticket({
        amount:body.amount,
        concept:body.concept,
        date:body.date,
        user:req.user._id
    });

    ticket.save((err,ticketDB)=>{

        if(err){
            return res.status(500).json({
                 ok:false,
                 err
             });
         }
         if(!ticketDB)return res.status(404).json({ok:false,message:'No se ha podido guardar el ticket'});
 
         res.json({
             ok:true,
             ticket:ticketDB  
         });
    });
});

app.get('/get-tickets/:id',(req,res)=>{

    //let id=req.params.id;
    //console.log(id)
    
    let id = req.params.id;

   Ticket.find({user:id}).exec((err,tickets)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            tickets
        })
    });
});

module.exports=app;