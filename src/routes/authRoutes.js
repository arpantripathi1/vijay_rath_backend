// routes/auth.js

const express = require('express');
const { signUp, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { validateSignup, validateLogin, validateForgotPassword, validateResetPassword } = require('../middleware/ValidateInputs');

const router = express.Router();

router.post('/signup', validateSignup, signUp);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;
