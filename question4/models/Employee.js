const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  hra: Number,
  da: Number,
  totalSalary: Number,
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate empId & salary calculation
EmployeeSchema.pre("save", function (next) {
  if (!this.empId) {
    this.empId = "EMP" + Date.now();
  }

  this.calculateSalaries();
  next();
});

// Method to calculate salaries
EmployeeSchema.methods.calculateSalaries = function() {
  this.hra = this.basicSalary * 0.2;
  this.da = this.basicSalary * 0.1;
  this.totalSalary = this.basicSalary + this.hra + this.da;
};

// Static method to update employee with salary recalculation
EmployeeSchema.statics.updateEmployeeWithSalaryRecalc = async function(id, updateData) {
  const employee = await this.findById(id);
  if (!employee) {
    throw new Error('Employee not found');
  }
  
  // Update basic fields
  if (updateData.name) employee.name = updateData.name;
  if (updateData.email) employee.email = updateData.email;
  if (updateData.basicSalary !== undefined) {
    employee.basicSalary = updateData.basicSalary;
    employee.calculateSalaries(); // Recalculate salaries if basicSalary changes
  }
  
  return await employee.save();
};

module.exports = mongoose.model("Employee", EmployeeSchema);
