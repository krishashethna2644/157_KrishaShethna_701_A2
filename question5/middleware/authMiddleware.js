const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const JWT_SECRET = 'your_super_secret_jwt_key_here_change_in_production';

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return req.path.startsWith('/api/') 
        ? res.status(401).json({ message: 'Access denied. No token provided.' })
        : res.redirect('/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const employee = await Employee.findById(decoded.id).select('-password');
    
    if (!employee) {
      return req.path.startsWith('/api/')
        ? res.status(401).json({ message: 'Token is not valid.' })
        : res.redirect('/login');
    }

    req.employee = employee;
    next();
  } catch (error) {
    return req.path.startsWith('/api/')
      ? res.status(401).json({ message: 'Token is not valid.' })
      : res.redirect('/login');
  }
};

// Optional: Check if user is admin (if needed for future features)
const requireAdmin = (req, res, next) => {
  // For now, we'll implement basic admin check
  // You can extend this based on your requirements
  if (req.employee && req.employee.email === 'admin@company.com') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required.' });
  }
};

module.exports = { verifyToken, requireAdmin };
