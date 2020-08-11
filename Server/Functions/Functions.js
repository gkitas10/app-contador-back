

const buildDataArrays=(tickets)=>{

  tickets.sort(function (a, b) {
    if (a.concept > b.concept) {
      return 1;
    }
    if (a.concept < b.concept) {
      return -1;
    }
   
    return 0;
  });

    const conceptArray=tickets.map(ticket=>(
        ticket.concept
    ));

    const conceptUnique=conceptArray.filter((concept,idx)=>(
        conceptArray.indexOf(concept)===idx
      ));

     

      const dataArrays= amounts(tickets);

      return dataArrays;
}

const amounts=(sorted)=>{
  let init=sorted[0].concept;
let filt=[];
outerloop:for(let i=0;i<sorted.length;i++){
  if(sorted[i].concept===init){ 
    let amount=0;
    for(let k=i;k<sorted.length;k++){
      if(sorted[k].concept===sorted[i].concept){
        amount+=sorted[k].amount; 
        if(sorted.indexOf(sorted[k+1])===-1){
          filt=[...filt,{concept:init,amount}];
          break outerloop;
        }
      }

      if(sorted[k].concept!==init){
        filt=[...filt,{concept:init,amount}];
        init=sorted[k].concept;
        break;
      }
    }
  }
  if(sorted[i].concept!==init){
    continue;
  }
}
return filt;

}  


module.exports={
  buildDataArrays
  
}