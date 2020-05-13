const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

let Schema=mongoose.Schema;

let rolesValidos={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'

};

let userSchema=new Schema({
    name:{type:String,required:[true,'El nombre es obligatorio']},
    email:{type:String,unique:true,required:[true,'El email es obligatorio']},
    password:{type:String,required:[true,'El password es obligatorio']},
    img:{ type:String,required:false},
    role:{ type:String, default:'USER_ROLE',enum:rolesValidos},
    status:{type:Boolean,default:true},
    google:{type:Boolean,default:false}

});

//Exclusión de la contraseña del modelo

userSchema.methods.toJSON=function(){
    let user=this;
    let userObject=user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});
module.exports=mongoose.model('User',userSchema);