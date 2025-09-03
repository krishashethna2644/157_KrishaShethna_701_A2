const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes - require authentication
router.use(verifyToken);

// Leave application pages
router.get('/apply', leaveController.getLeaveApplication);
router.get('/list', leaveController.getLeaveList);

// API routes
router.post('/api/apply', leaveController.applyLeave);
router.get('/api/my-leaves', leaveController.getMyLeaves);

// Admin routes (commented out for now, can be enabled later)
// router.get('/api/all', leaveController.getAllLeaves);
// router.put('/api/:leaveId/status', leaveController.updateLeaveStatus);

module.exports = router;
