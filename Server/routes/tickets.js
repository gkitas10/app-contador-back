const express=require('express');
const app=express();
const Ticket=require('../models/ticket');
const {verificaToken}=require('../middlewares/auth');
const {buildDataArrays}=require('../Functions/Functions');



app.post('/save-ticket',verificaToken,(req,res)=>{
    let body=req.body;

    let ticket=new Ticket({
        amount:body.amount,
        concept:body.concept,
        product:body.product,
        provider:body.provider,
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

app.post('/ticket-items/:user',(req,res)=>{
    let {body}=req;

    if(body.concept===''){
        delete body.concept;
    }

    if(body.product===''){
        delete body.product;
    }

    if(body.provider===''){
        delete body.provider;
    }

    if(body.date===''){
        delete body.date;
    }

    if(body.hasOwnProperty('month')){
        if(body.month===''){
            delete body.month;
        }else{
            body.date=new RegExp('^'+body.month);
            delete body.month;
        }    
    }

    const {user}=req.params;
    
    body={
        ...body,
        user
    }

    let {from}=req.query;
    
    Ticket.find(
        body
    )
    .skip(+from)
    .limit(12)
    .exec((err,ticketsDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Ticket.countDocuments(body,(err, count) => {
            console.log(count);
            res.json({
                ok: true,
                ticketsDB,
                count
            });
        });
    });
});

app.get('/get-tickets/:userid',verificaToken,(req,res)=>{
    
    if(Object.keys(req.query).length!==0){
        const {month}=req.query;
        const {userid}=req.params;
        const reg=new RegExp('^'+month);
        
        Ticket.find({
            user:userid,
            date:reg
          }).exec((err,tickets)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if(tickets.length===0){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No tickets with that date'
                    }
                });
            }
            
            const dataArrays=buildDataArrays(tickets);
            
            res.json({
                ok:true,
                 dataArrays
                
            });
        });  

        return;
    }
        
    let id = req.params.userid;

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