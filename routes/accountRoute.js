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

// ✅ Account update form (original route)
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdateForm))

// ✅ Account update form (new route to match EJS link)
router.get("/edit/:accountId", utilities.handleErrors(accountController.buildUpdateForm)) // ✅ Added

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
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// ✅ Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// ✅ Feedback form view
router.get("/feedback", utilities.handleErrors(accountController.buildFeedbackForm))

// ✅ Feedback form submission
router.post("/feedback", utilities.handleErrors(accountController.submitFeedback))

module.exports = router