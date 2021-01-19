const Ticket = require('../models/ticket');
const createError = require('http-errors');
//Construct ticket obj array with totals for get get-tickets/:user req.query.month
const buildDataArrays = ( tickets, prop ) => {
    const sortedTickets = sortTickets(tickets, prop);
    const accumulatedAmountsArray= accumulatedAmounts( sortedTickets, prop );

    return accumulatedAmountsArray;
}
//Construct amount array for tickets-graph/:user
const buildAmountsArray = async ( body, prop, label, res, next ) => {
  //Validate time period
  if( body.date && !body.month && !body.year ) {
    const month = body.date.slice(0,7);
    body = {
      ...body,
      date:new RegExp( '^' + month )
    }

//get month-tickets array and labels for graph component
    const dataForGraph =  getSecondArray( body, prop, label, next );

    return dataForGraph;
  }
//Validate time period
if( body.month ) {
  const year = body.month.slice(0,4);
  delete body.month;

    body = {
      ...body,
      date:new RegExp( '^' + year )
    }
    
    const dataForGraph =  getSecondArrayForMonth( body, prop, label, next );
    
    return dataForGraph;
}

if( body.year && body.date ) {
  delete body.year
  //const dataForGraph = getSecondArray( body, prop, label )
  let body2 = {}
  if( body.concept ) {
    body2 = {
      concept:body.concept,
      user:body.user
    }
  }

 if( !body.concept ) {
  body2 = {
    user:body.user
  }
 }

  try {
    const ticketsDB = await Ticket.find(
      body2
    );
    
    if(ticketsDB.length === 0){
      throw createError(401, 'No se encontraron tickets de gasto para la gráfica')
  }

    const sortedTickets = sortTickets( ticketsDB, 'date' )
     //Slice date prop to get only the year numbers
     for ( let i = 0; i < sortedTickets.length; i++ ) {
      sortedTickets[i].date = sortedTickets[i].date.slice(0,4)
    }

    const yearSliced = sortedTickets;
    const accumulatedAmountsArray = accumulatedAmounts( yearSliced, 'date' )
    const amountsArray = accumulatedAmountsArray.map( ticket => (
      ticket.amount
    ));

    const labelsArray = accumulatedAmountsArray.map( ticket => (
      ticket.concept
    ));

    let dataObj = {
      data:amountsArray,
      label:label
    }
  
    let dataForGraph = [ dataObj, labelsArray ];

    return dataForGraph;


} catch (error) {
    next(error)
}
  

}

}

//takes sorted array and returns ticket obj array (local function, is used inside buildDataArrays)
const accumulatedAmounts = ( sorted, prop ) => {
  let init=sorted[0][`${prop}`];
let filt=[];
outerloop:for(let i=0;i<sorted.length;i++){
  if(sorted[i][`${prop}`]===init){ 
    let amount=0;
    for(let k=i;k<sorted.length;k++){
      if(sorted[k][`${prop}`]===sorted[i][`${prop}`]){
        amount+=sorted[k].amount; 
        if(sorted.indexOf(sorted[k+1])===-1){
          filt=[...filt,{concept:init,amount}];
          break outerloop;
        }
      }

      if(sorted[k][`${prop}`]!==init){
        filt=[...filt,{concept:init,amount}];
        init=sorted[k][`${prop}`];
        break;
      }
    }
  }
  if(sorted[i][`${prop}`]!==init){
    continue;
  }
}
return filt;

}  
//function that sorts array based on prop
const sortTickets = (tickets, prop) => {
  tickets.sort(function (a, b) {
    if (a[`${prop}`] > b[`${prop}`]) {
      return 1;
    }

    if (a[`${prop}`] < b[`${prop}`]) {
      return -1;
    }
   
    return 0;
  });

  return tickets;
}
//Response array sent to graphics front component
const findReq = async ( body, secondArray , res, next ) => {
  try {
    const ticketsDB = await Ticket.find(
        body
    );

    const data = [ ticketsDB, secondArray ];

    if(data[0].length === 0){
      throw createError(400, 'No se encontraron tickets de gasto en este período')
    }

    return res.json({
        ok:true,
        data
    });

} catch (error) {
    next(error)
}
}
//Request that structures the 2nd array of findReq for graphics front component
//Takes a prop to sort the tickets and choose the labels from below the graph component
//Takes the main label or "header" of the graph front component 
const getSecondArray = async ( body, prop, label, next ) => {
  
  try {
    const ticketsDB = await Ticket.find( body );

    if(ticketsDB.length === 0){
      throw createError(401, 'No se encontraron tickets de gasto para la gráfica')
  }
    
    const sortedTickets = sortTickets(ticketsDB, prop);
    const accumulatedAmountsArray = accumulatedAmounts( sortedTickets, prop );
    //This new objs have a concept prop with concept labels, dates, months or years
    const labelsArray = accumulatedAmountsArray.map( ticket => (
    ticket.concept
  ));

    const amountsArray = accumulatedAmountsArray.map(ticket => (
      ticket.amount
    ));
  
    let dataObj = {
      data:amountsArray,
      label:label
    }
  
    let dataForGraph = [ dataObj, labelsArray ];
    return dataForGraph;
  
    } catch (error) {
      return next(error)
    }
  }
//Function used in case body comes with month prop, returns data array for graphics and
//graph front components
  const getSecondArrayForMonth = async ( body, prop, label, next ) => {
  
    try {
      const ticketsDB = await Ticket.find( body );
       
      if(ticketsDB.length === 0){
        throw createError(401, 'No se encontraron tickets de gasto para la gráfica')
    }
      const sortedTickets = sortTickets(ticketsDB, prop)
      
      //Slice date prop to get only the month numbers
      for ( let i = 0; i < sortedTickets.length; i++ ) {
        sortedTickets[i].date = sortedTickets[i].date.slice(5,7)
      }

      const monthSliced = sortedTickets;

      const accumulatedAmountsArray = accumulatedAmounts( monthSliced, prop );
      //Turn month number into string labels
      let labelsArray=[];

    for (let i = 0; i < accumulatedAmountsArray.length; i++ ) {
      switch ( accumulatedAmountsArray[i].concept ){
        case '01':labelsArray.push('Enero')
        break;
        case '02':labelsArray.push('Febrero')
        break;
        case '03':labelsArray.push('Marzo')
        break;
        case '04':labelsArray.push('Abril')
        break;
        case '05':labelsArray.push('Mayo')
        break;
        case '06':labelsArray.push('Junio')
        break;
        case '07':labelsArray.push('Julio')
        break;
        case '08':labelsArray.push('Agosto')
        break;
        case '09':labelsArray.push('Septiembre')
        break;
        case '10':labelsArray.push('Octubre')
        break;
        case '11':labelsArray.push('Noviembre')
        break;
        case '12':labelsArray.push('Diciembre')
        break;
      }
    }
      
      const amountsArray = accumulatedAmountsArray.map(ticket => (
        ticket.amount
      ));
    
      let dataObj = {
        data:amountsArray,
        label:label
      }
    
      let dataForGraph = [ dataObj, labelsArray ];
      return dataForGraph;
    
      } catch (error) {
         return next(error)
      }
    }




module.exports={
  buildDataArrays,
  buildAmountsArray,
  findReq,
  getSecondArray,
  getSecondArrayForMonth
}