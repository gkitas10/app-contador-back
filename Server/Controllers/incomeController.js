const Income = require('../models/income');
const createError = require('http-errors');

exports.saveIncome = async ( req, res ) => {
    let { body } = req;
    let { _id } = req.user;
    

    body = {
        ...body,
        user:_id
    }

    let income = new Income( body );

    try {
        const incomeDB = await income.save();
        console.log(incomeDB);
        res.status(200).json({
            ok:true,
            data:incomeDB
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            error
        })
    }
}

exports.getIncome = runAsyncWrapper( async ( req, res ) => {
    const { month } = req.query;
    const { _id } = req.user;

        const incomeObjsDB = await Income.find({
            month,
            user:_id
        })

        if(incomeObjsDB.length === 0){
            throw new createError(400, 'No se encontraron ingresos en este período')
        }

        res.status(200).json({
            ok:true,
            data:incomeObjsDB
        }); 
    })  

exports.deleteIncome = async (req, res) => {
  //  const { _id } = req.user;
    const { id } = req.params;

    try {
        const incomeDB = await Income.findOneAndRemove({
         //   user:_id,
            _id:id
        })

        console.log(incomeDB)
    
        res.json({
            msg:'El item de ingreso ha sido eliminado',
            incomeDB
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error
        })
    }
    
}

function runAsyncWrapper (callback) {
    return function (req, res, next) {
      callback(req, res, next)
        .catch(next)
    }
  }