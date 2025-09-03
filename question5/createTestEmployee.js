const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const bcrypt = require('bcryptjs');

async function createTestEmployee() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/erp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if test employee already exists
    const existingEmployee = await Employee.findOne({ email: 'test@employee.com' });
    if (existingEmployee) {
      console.log('Test employee already exists:');
      console.log('Email: test@employee.com');
      console.log('Password: testpassword123');
      console.log('Employee ID:', existingEmployee.empId);
      return;
    }

    // Create test employee
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const testEmployee = new Employee({
      name: 'Test Employee',
      email: 'test@employee.com',
      password: hashedPassword,
      department: 'IT',
      position: 'Software Developer',
      basicSalary: 50000
    });

    await testEmployee.save();
    
    console.log('Test employee created successfully:');
    console.log('Email: test@employee.com');
    console.log('Password: testpassword123');
    console.log('Employee ID:', testEmployee.empId);

  } catch (error) {
    console.error('Error creating test employee:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createTestEmployee();
