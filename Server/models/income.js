const mongoose=require('mongoose');

let Schema=mongoose.Schema;

let incomeSchema=new Schema({
    concept:{ type:String, required:[ true, 'El concepto es obligatorio' ]},
    amount:{ type:Number,required:[ true, 'La cantidad es obligatoria' ]},
    month:{ type:String, required:[ true, 'La fecha es obligatoria' ]},
    notes:{ type:String },
    user:{ type:Schema.Types.ObjectId, ref:'User' }  
});


module.exports = mongoose.model('Income', incomeSchema);