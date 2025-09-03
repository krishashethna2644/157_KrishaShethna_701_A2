// controllers/authController.js

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  // simple static admin check
  if (username === "admin" && password === "admin123") {
    req.session.isAuth = true;
    return res.redirect("/employees/dashboard");
  } else {
    return res.render("login", { error: "Invalid credentials!" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
