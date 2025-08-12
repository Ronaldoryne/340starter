const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const validate = require("../utilities/account-validation")
const utilities = require("../utilities")

// ✅ Account management view
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

// ✅ Registration and login views
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// ✅ Account update form
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdateForm))

// ✅ Process registration
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// ✅ Process login
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.loginAccount)
)

// ✅ Process account update
router.post(
  "/update/:accountId",
  validate.updateRules(),         // ✅ Validation rules for update
  validate.checkUpdateData,       // ✅ Middleware to handle errors
  utilities.handleErrors(accountController.updateAccount)
)

// ✅ Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router