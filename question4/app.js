const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// connect to MongoDB with better error handling
mongoose.connect("mongodb://127.0.0.1:27017/erp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  console.log("Please make sure MongoDB is running on your system");
});

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "erp-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/erp" }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
  })
);
// routes
app.use("/", authRoutes);
app.use("/employees", employeeRoutes);

// root redirect
app.get("/", (req, res) => res.redirect("/login"));

// convenience redirect for /dashboard
app.get("/dashboard", (req, res) => res.redirect("/employees/dashboard"));

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
