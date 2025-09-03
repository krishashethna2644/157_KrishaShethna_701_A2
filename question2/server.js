const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // handles form data

// Configure File Session Store
app.use(
  session({
    store: new FileStore({ path: "./sessions" }),
    secret: "mysecret",
    resave: true,              // ✅ ensure session is saved on every request
    saveUninitialized: false,  // ✅ do not create empty sessions
    cookie: { maxAge: 60000 }  // 1 min expiry
  })
);

// Static login credentials
const USER = { username: "krisha", password: "shethna" };

// Routes
app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = { username };

    // ✅ explicitly save session before redirect
    req.session.save(() => {
      res.redirect("/result");
    });
  } else {
    res.render("login", { error: "Invalid credentials!" });
  }
});

app.get("/result", (req, res) => {
  if (req.session.user) {
    res.render("result", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
