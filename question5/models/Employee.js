const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// Auto-generate empId
EmployeeSchema.pre("save", function (next) {
  if (!this.empId) {
    this.empId = "EMP" + Date.now().toString().slice(-6);
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

// Compare password method
EmployeeSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};



module.exports = mongoose.model("Employee", EmployeeSchema, "employees");
