const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.post( '/login', userController.logIn );
router.post('/signup', userController.signUp );
router.post('/google-sign-in', userController.googleSignIn);

module.exports = router;