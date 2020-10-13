const Income = require('../models/income');

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

exports.getIncome = async ( req, res ) => {
    const { month } = req.query;
    const { _id } = req.user;

    try {
        const incomeObjsDB = await Income.find({
            month,
            user:_id
        })

        res.status(200).json({
            ok:true,
            data:incomeObjsDB
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error
        })
    }  
}