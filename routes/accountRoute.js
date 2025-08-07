const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process registration with validation middleware
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login attempt
router.post("/login", utilities.handleErrors(accountController.accountLogin));

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;