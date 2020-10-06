const mongoose=require('mongoose');

let Schema=mongoose.Schema;

let incomeSchema=new Schema({
    amount:{ type:Number,required:[ true, 'La cantidad es obligatoria' ]},
    concept:{ type:String, required:[ true, 'El concepto es obligatorio' ]},
    notes:{ type:String },
    month:{ type:String, required:[ true, 'La fecha es obligatoria' ]},
    user:{ type:Schema.Types.ObjectId, ref:'User' }  
});


module.exports = mongoose.model('Income', incomeSchema);