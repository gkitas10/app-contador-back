
//PORT
process.env.PORT = process.env.PORT || 3000;
//ENV
process.env.NODE_ENV=process.env.NODE_ENV||'dev';
//SEED
process.env.SEED=process.env.SEED||'este-es-el-seed-desarrollo';
//Fecha de vencimiento de token
process.env.CADUCIDAD_TOKEN=60 * 60;

//DB
let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/contador';
}else{
   urlDB=process.env.MONGO_URI;
}
process.env.URLDB=urlDB;

