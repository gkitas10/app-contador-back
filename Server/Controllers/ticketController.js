const Ticket = require('../models/ticket');
const createError = require('http-errors');
const { 
    buildDataArrays, buildAmountsArray, findReq,
    getSecondArray,getSecondArrayForMonth
 } = require('../Functions/Functions');


exports.createTicket = ( req, res ) => {
    let body = req.body;
    console.log(body)

    let ticket = new Ticket({
        amount:body.amount,
        concept:body.concept.toLowerCase(),
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
    
    const { user } = req.params;
    
    body = {
        ...body,
        user
    }
    //Create reg ex to include more tickets w variations
    const reg = new RegExp()
    const { from } = req.query;
    
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

exports.getTicketsForGraphics = async ( req, res, next ) => {
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
        const dataForGraph = await buildAmountsArray( 
            body,
            'date', 
            'Todo el gasto durante el mes',
            res,
            next
            );

        if(res.headersSent){
            return;
        }    

        findReq( body, dataForGraph, res, next );
        return;
    }
   
    if( body.month ) {
        const month = body.month;

        body = {
                ...body,
                date:new RegExp( '^' + month )
              }

        const dataForGraph = await buildAmountsArray( 
            body,
            'date', 
            'Todo el gasto durante el año',
            res,
            next 
            );

        if(res.headersSent){
            return;
        }

        findReq( body, dataForGraph, res, next );
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
            'Todo el gasto divido anualmente',
            res,
            next 
            );

        if(res.headersSent){
            return;
        }    
         
        findReq( body, dataForGraph, res, next );
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
          }).exec((error,tickets)=>{
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if( tickets.length === 0 ) {
                return res.status(400).json({
                    ok: false,
                    error: 'No se encontraron tickets'
                    
                });
            }
            
            const dataArrays=buildDataArrays( tickets, 'concept');
            console.log(dataArrays)
            res.json({
                ok:true,
                dataArrays,
            });
        });
    }

    exports.getAccumulatededProductsAmounts = async ( req, res ) => {
        const { concept } = req.query;
        const { month } = req.query;
        const { _id } = req.user;
        const reg = new RegExp('^'+month);
       
        try {
            const ticketsDB = await Ticket.find({
                concept,
                date:reg,
                user:_id
            });

            const accumulatedProductsAmounts = buildDataArrays( ticketsDB, 'product' );

            res.json({
                ok:true,
                data:accumulatedProductsAmounts
            });

        } catch (error) {
            res.status(500).json({
                ok:false,
                error
            });
        }
    }  
    //For comparative graphics
    exports.dataGraphics = async (req, res, next) => {
        let query = req.query;
        const { _id } = req.user;

        query = {
            ...query,
            user:_id
        }

        if( query.concept === 'undefined' || query.concept === '' ) delete query.concept;
        if( query.month === 'undefined' ) {
            delete query.month
        }else{
            const regExp = new RegExp(`^${query.month}`)
//Even though there is query.month, here the function works w dates
            query = {
                ...query,
                date:regExp,
                func:'getSecondArray'
            }

            delete query.month
        }
//Here use getSecondArrayForMonth beacause its gonna work w months
        if( query.year === 'undefined' || query.year === '' ) {
            delete query.year
        }else{
            const regExp = new RegExp(`^${query.year}`)
            query = {
                ...query,
                date:regExp,
                func:'getSecondArrayForMonth'
                
            }

            delete query.year
        }
        
        if( query.func === 'getSecondArray'){
            delete query.func
            try {
                const data = await getSecondArray(query, 'date', 'Gastos durante el mes', next);
                if(res.headersSent) return;
                
                return res.json({
                    ok:true,
                    data
                });

            } catch (error) {
                next(error);
            }
            
            

              
        }

        if( query.func === 'getSecondArrayForMonth'){
            delete query.func
               const data = await getSecondArrayForMonth(query, 'date', 'Gastos durante el año', next);
             
               res.json({
                   ok:true,
                   data
               });
        }
    }

    exports.dataForPieChart =  async (req, res, next) => {
        
        let query = req.query;
        const { _id } = req.user;

        query = {
            ...query,
            user:_id
        }
        
        if(query.month !== 'undefined' && query.month !== ''){
            delete query.year;
            const regExp = new RegExp(`^${query.month}`)
            query = {
                ...query,
                date:regExp
            }

            delete query.month;
        }
        
        if(query.year !== 'undefined' && query.year !== undefined) {
            console.log('executing')
            delete query.month;
            const regExp = new RegExp(`^${query.year}`);
            query = {
                ...query,
                date:regExp
            }

            delete query.year;
        }
        console.log('1', query)
        try {
            const ticketsDB = await Ticket.find(query);

            if(ticketsDB.length === 0){
                throw createError(400, 'No se encontraron tickets de gasto para la gráfica')
            }

            let accConcept = buildDataArrays( ticketsDB, 'concept' );
            console.log(accConcept)
            let dataArrays = [[], []]

            accConcept = accConcept.reduce((prev, curr, idx, arr) => {
                dataArrays[0].push(curr.concept)
                dataArrays[1].push(curr.amount) 
                return dataArrays;
                
            }, []);

            console.log(accConcept)

            res.json({
                ok:true,
                data:accConcept
            })


        } catch (error) {
            next(error)
        }
        
        
    }


