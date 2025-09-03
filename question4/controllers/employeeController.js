// controllers/employeeController.js
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Dashboard
exports.getDashboard = async (req, res) => {
  const employees = await Employee.find();
  res.render("dashboard", { employees });
};

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, basicSalary, password, department, position } = req.body;

    if (!password) {
      return res.status(400).send("Password is required");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmp = new Employee({
      name,
      email,
      basicSalary,
      password: hashedPassword,
      department,
      position: position || 'Employee'
    });

    await newEmp.save();
    
    // Get the generated empId after save
    const empId = newEmp.empId;

    // Email sending functionality commented out to avoid errors
    
    res.redirect("/employees/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating employee");
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, basicSalary } = req.body;
    
    // Use the new method that recalculates salaries when basicSalary changes
    await Employee.updateEmployeeWithSalaryRecalc(id, { name, email, basicSalary });
    res.redirect("/employees/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating employee");
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);
  res.redirect("/employees/dashboard");
};
