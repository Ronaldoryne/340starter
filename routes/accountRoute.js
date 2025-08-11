const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Default account management view (protected)
router.get(
  "/",
  utilities.checkLogin, // <-- added middleware to protect the route
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process registration
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

// Process login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;