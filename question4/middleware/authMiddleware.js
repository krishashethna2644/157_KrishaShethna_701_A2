// Authentication middleware to protect routes
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuth) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

module.exports = { requireAuth };
