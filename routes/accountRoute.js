const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// 🛡️ Protected Account Management View
router.get(
  "/",
  utilities.checkLogin, // Middleware to ensure user is logged in
  utilities.handleErrors(accountController.buildAccountManagement)
)

// 📝 Registration View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// 🔐 Login View
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// 📨 Process Registration
router.post(
  "/register",
  regValidate.registrationRules(), // Add validation rules
  regValidate.checkRegData,        // Validate and sanitize input
  utilities.handleErrors(accountController.registerAccount)
)

// 🔑 Process Login Attempt
router.post(
  "/login",
  regValidate.loginRules(),        // Add login validation rules
  regValidate.checkLoginData,      // Validate login input
  utilities.handleErrors(accountController.accountLogin)
)

// 🚪 Logout Route
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router