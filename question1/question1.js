const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const { body, validationResult } = require("express-validator");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.json()); // parse JSON body
app.use(fileUpload({ createParentPath: true })); // enable file uploads

// Static for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Show form
app.get("/", (req, res) => {
  res.render("form", { errors: [], old: {} });
});

// Handle form submit
app.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("hobbies").notEmpty().withMessage("Select at least one hobby")
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("form", {
        errors: errors.array(),
        old: req.body
      });
    }

    let profilePicName = null;
    let otherPicsNames = [];

    // --- Handle profile picture upload ---
    if (req.files && req.files.profilePic) {
      const profilePic = req.files.profilePic;
      profilePicName = Date.now() + "-" + profilePic.name;
      await profilePic.mv(path.join(__dirname, "uploads", profilePicName));
    }

    // --- Handle multiple other pics ---
    if (req.files && req.files.otherPics) {
      let otherPics = req.files.otherPics;
      if (!Array.isArray(otherPics)) otherPics = [otherPics];

      for (let pic of otherPics) {
        const picName = Date.now() + "-" + pic.name;
        await pic.mv(path.join(__dirname, "uploads", picName));
        otherPicsNames.push(picName);
      }
    }

    // Save user data
    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: req.body.hobbies,
      profilePic: profilePicName,
      otherPics: otherPicsNames
    };

    fs.writeFileSync("userData.json", JSON.stringify(userData, null, 2));

    res.render("result", { user: userData });
  }
);

// --- File Download Route ---
app.get("/download", (req, res) => {
  res.download(path.join(__dirname, "userData.json"));
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
