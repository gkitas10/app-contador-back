const express = require( 'express' );
const router = express.Router();
const { verificaToken } = require('../middlewares/auth');
const incomeController = require('../Controllers/incomeController');

router.post( '/save-income', verificaToken, incomeController.saveIncome );
router.get( '/get-income', verificaToken, incomeController.getIncome );
router.delete( '/delete-income/:id', verificaToken,incomeController.deleteIncome );

module.exports = router;