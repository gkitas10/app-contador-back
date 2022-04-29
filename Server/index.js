require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
var admin = require('firebase-admin');
const cors = require('cors');
const errorHandler = require('./errorHandler/errorHandler');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//Routes
app.use('/', require('./routes/users'));
app.use('/', require('./routes/tickets'));
app.use('/', require('./routes/income'));
app.use(errorHandler)

mongoose.connect(process.env.URLDB,{
    useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false },(err,res)=>{
    if(err) throw err;
    console.log('conexión exitosa con la DB');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});