const mongoose=require('mongoose');

let Schema=mongoose.Schema;

let ticketSchema=new Schema({

    amount:{type:Number,required:[true,'La cantidad es obligatoria']},
    concept:{type:String,required:[true,'El concepto es obligatorio']},
    product:{type:String,required:[true,'El producto o servicio es obligatorio']},
    provider:{type:String,required:[true,'El provedor o tienda es obligatorio']},
    date:{type:String,required:[true,'La fecha es obligatoria']},
    user:{type:Schema.Types.ObjectId,ref:'User'}  
});


module.exports=mongoose.model('Ticket',ticketSchema);