const jwt=require('jsonwebtoken');

let verificaToken = ( req, res, next ) => {
    
    let token = req.get('access_token');
  
    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        if(err){
            return res.status(400).json({
                err
            });
        }
        
        req.user = decoded.user;
        next();
    });

};

module.exports = { verificaToken }