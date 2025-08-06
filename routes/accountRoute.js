const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process registration
 router.post("/register", utilities.handleErrors(accountController.registerAccount));

// Process login attempt
router.post("/login", utilities.handleErrors(accountController.accountLogin));

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));
// Route to process registration form submission
router.post("/register", utilities.handleErrors(accountController.registerAccount))



module.exports = router;