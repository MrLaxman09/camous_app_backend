const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// REGISTER VALIDATION
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().isEmail().withMessage('Valid email required'),
  body('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('enrollmentNo')
    .notEmpty()
    .matches(/^[0-9A-Z]+$/)
    .withMessage('Enrollment must be capital letters & numbers only'),
  body('course').notEmpty().withMessage('Course is required')
];

// LOGIN VALIDATION
const validateLogin = [
  body('email').trim().notEmpty().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// AUTH ROUTES
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/admin-login', validateLogin, login, authorize('admin'));

// PROTECTED ROUTES
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
