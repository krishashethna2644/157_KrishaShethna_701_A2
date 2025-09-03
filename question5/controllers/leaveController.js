const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { date, reason } = req.body;
    
    const employee = await Employee.findById(req.employee._id);
    
    const leave = new Leave({
      employeeId: req.employee._id,
      empId: employee.empId,
      employeeName: employee.name,
      date: new Date(date),
      reason
    });
    
    await leave.save();
    
    res.json({ 
      message: 'Leave application submitted successfully',
      leave 
    });
  } catch (error) {
    console.error('Leave application error:', error);
    res.status(500).json({ message: 'Error submitting leave application' });
  }
};

// Get all leaves for current employee
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.employee._id })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave applications' });
  }
};

// Get leave application page
exports.getLeaveApplication = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.render('leave-application', { employee });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading leave application page' });
  }
};

// Get leave list page
exports.getLeaveList = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.render('leave-list', { employee });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading leave list page' });
  }
};

// Update leave status (admin function)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;
    
    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { 
        status,
        granted: status === 'approved'
      },
      { new: true }
    );
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    
    res.json({ message: 'Leave status updated successfully', leave });
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave status' });
  }
};

// Get all leaves (admin function)
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employeeId', 'name email empId')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all leave applications' });
  }
};
