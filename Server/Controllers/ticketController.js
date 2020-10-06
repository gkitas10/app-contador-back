const Ticket = require('../models/ticket');
const { 
    buildDataArrays, buildAmountsArray, findReq
 } = require('../Functions/Functions');



exports.createTicket = ( req, res ) => {
    let body = req.body;
    console.log(body)

    let ticket = new Ticket({
        amount:body.amount,
        concept:body.concept,
        product:body.product,
        provider:body.provider,
        notes:body.notes,
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
}


exports.getTicketItems = ( req, res ) => {
    let {body}=req;
    console.log(body)
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
};

exports.getTicketsForGraphics = async ( req, res ) => {
    //get tickets array and data for graphics and graph front components
    let { body } = req;
    const { user } = req.params;
    
    body={
        ...body,
        user
    }
    
    if( body.concept === '' ) {
        delete body.concept;
    }

    if( body.date ) {
        console.log('bfunc', body)
        const dataForGraph = await buildAmountsArray( 
            body,
            'date', 
            'Todo el gasto durante el mes' 
            );

            console.log('afunc', body)

        findReq( body, dataForGraph, res );
        return;
    }
   
    if( body.month ) {
        console.log('bfunc', body)

        const month = body.month;

        body = {
                ...body,
                date:new RegExp( '^' + month )
              }

        const dataForGraph = await buildAmountsArray( 
            body,
            'date', 
            'Todo el gasto durante el año' 
            );

        
        console.log('afunc', body)
         
        findReq( body, dataForGraph, res );
        return;
    }

    if( body.year ) {
        const year = body.year;

        body = {
                ...body,
                date:new RegExp( '^' + year )
              }

        const dataForGraph = await buildAmountsArray( 
            body,
            'date', 
            'Todo el gasto durante el año' 
            );
         
        findReq( body, dataForGraph, res );
        
        return; 
    }

};

exports.getTicketsForTable = ( req, res ) => {
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

            if( tickets.length === 0 ) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No tickets with that date'
                    }
                });
            }
            
            const dataArrays=buildDataArrays(tickets);
            console.log(dataArrays);
            res.json({
                ok:true,
                 dataArrays 
            });
        });
    }  

