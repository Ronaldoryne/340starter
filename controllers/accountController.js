const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()
const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  let message = req.flash("notice")
  res.render("account/login", {
    title: "Login",
    nav,
    message,
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  let message = req.flash("notice")
  res.render("account/register", {
    title: "Register",
    nav,
    message,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).redirect("/account/register")
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        errors: null,
        account_email,
      })
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000,
      })

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "An unexpected error occurred. Please try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Build account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(res.locals.accountId)
  res.render("account/manage", {
    title: "Account Management",
    nav,
    errors: null,
    messages: req.flash("notice"),
    accountData,
  })
}

/* ****************************************
 *  Logout the user
 * *************************************** */
function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
}

/* ****************************************
 *  Show update form
 * *************************************** */
async function showUpdateForm(req, res) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.params.id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    account: accountData,
    errors: null,
    message: req.flash("notice"),
  })
}

/* ****************************************
 *  Process account info update
 * *************************************** */
async function processUpdate(req, res) {
  let nav = await utilities.getNav()
  const { accountId, firstName, lastName, email } = req.body

  const updateResult = await accountModel.updateAccount(accountId, firstName, lastName, email)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
  } else {
    req.flash("notice", "Update failed. Please try again.")
  }

  const accountData = await accountModel.getAccountById(accountId)
  res.render("account/manage", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
    messages: req.flash("notice"),
  })
}

/* ****************************************
 *  Process password change
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { accountId, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await accountModel.updatePassword(accountId, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    const accountData = await accountModel.getAccountById(accountId)
    res.render("account/manage", {
      title: "Account Management",
      nav,
      accountData,
      errors: null,
      messages: req.flash("notice"),
    })
  } catch (error) {
    console.error(error)
    req.flash("notice", "An error occurred while updating the password.")
    const accountData = await accountModel.getAccountById(accountId)
    res.render("account/update", {
      title: "Update Account",
      nav,
      account: accountData,
      errors: null,
      message: req.flash("notice"),
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountLogout,
  buildAccountManagement,
  showUpdateForm,
  processUpdate,
  changePassword,
}