const Employee = require('../models/Employee');

// Get employee profile page
exports.getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.render('profile', { employee });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render('error', { message: 'Error loading profile' });
  }
};

// Get employee profile data (API)
exports.getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update employee profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, position } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.employee._id,
      { name, department, position },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ message: 'Profile updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get all employees (for admin purposes)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Create new employee (admin function)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, basicSalary, password } = req.body;
    
    const employee = new Employee({
      name,
      email,
      department,
      position,
      basicSalary,
      password
    });
    
    await employee.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee' });
  }
};
