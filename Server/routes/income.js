const express = require( 'express' );
const router = express.Router();
const { verificaToken } = require('../middlewares/auth');
const incomeController = require('../Controllers/incomeController');

router.post( '/save-income', verificaToken, incomeController.saveIncome );
router.get( '/get-income', verificaToken, incomeController.getIncome );

module.exports = router;