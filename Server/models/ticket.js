const mongoose=require('mongoose');

let Schema=mongoose.Schema;

let ticketSchema=new Schema({

    amount:{type:Number,required:[true,'La cantidad es obligatoria']},
    concept:{type:String,required:[true,'El concepto es obligatorio']},
    date:{type:Date,required:[true,'Lafecha es obligatoria']},
    user:{type:Schema.Types.ObjectId,ref:'User'}  
});


module.exports=mongoose.model('Ticket',ticketSchema);