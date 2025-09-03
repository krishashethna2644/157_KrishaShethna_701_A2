const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

const JWT_SECRET = 'your_super_secret_jwt_key_here_change_in_production';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
};

// Login page
exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

// Employee login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await employee.comparePassword(password);
    if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    

    // Generate token
    const token = generateToken(employee._id);

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Redirect to profile page
    res.redirect('/employees/profile');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Server error. Please try again.' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// Get current employee profile (for API)
exports.getCurrentEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
