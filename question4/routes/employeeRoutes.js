const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const Employee = require("../models/Employee");
const { requireAuth } = require("../middleware/authMiddleware");

// Apply authentication middleware to all employee routes
router.use(requireAuth);

// Dashboard (handles listing employees too)
router.get("/dashboard", employeeController.getDashboard);

// Add employee form
router.get('/add', (req, res) => res.render("addEmployee"));

// Insert employee
router.post('/add', employeeController.createEmployee);

// Edit employee form
router.get('/edit/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  res.render("editEmployee", { employee });
});

// Update employee
router.post('/edit/:id', employeeController.updateEmployee);

// Delete employee
router.get('/delete/:id', employeeController.deleteEmployee);

// Logout - use auth controller instead
const authController = require("../controllers/authController");
router.get('/logout', authController.logout);

module.exports = router;
