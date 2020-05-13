const express=require('express');
const app=express();

app.use(require('./users'));
app.use(require('./tickets'));
module.exports=app;