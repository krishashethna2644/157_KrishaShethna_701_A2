const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.use(verifyToken);

// Profile page
router.get('/profile', employeeController.getProfile);

// API routes
router.get('/api/profile', employeeController.getEmployeeProfile);
router.put('/api/profile', employeeController.updateProfile);

// Admin routes (commented out for now, can be enabled later)
// router.get('/api/all', employeeController.getAllEmployees);
// router.post('/api/create', employeeController.createEmployee);

module.exports = router;
