require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const app=express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, access_token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true},(err,res)=>{
    if(err) throw err;
    console.log('conexión exitosa con la DB');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});