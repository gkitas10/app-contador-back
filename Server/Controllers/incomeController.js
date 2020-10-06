const Income = require('../models/income');

exports.saveIncome = async ( req, res ) => {
    let { body } = req;
    let { id } = req.user;

    body = {
        ...body,
        user:id
    }

    let income = new Income( body );

    try {
        const incomeDB = await income.save();
        console.log(incomeDB);
        
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
    const { id } = req.user;

    try {
        const incomeObjsDB = await Income.find({
            month,
            user:id
        })

        res.status(200).json({
            ok:true,
            incomeObjsDB
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error
        })
    }

    
}