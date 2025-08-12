const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

const accountController = {}

// ✅ Render account management view
accountController.buildAccountManagement = async function (req, res) {
  const nav = await utilities.getNav(res)
  const accountData = req.session.account
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    message: req.flash("notice"),
    errors: [],
  })
}

// ✅ Render registration form
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav(res)
  res.render("account/register", {
    title: "Register",
    nav,
    message: req.flash("notice"),
    errors: [],
  })
}

// ✅ Render login form
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav(res)
  res.render("account/login", {
    title: "Login",
    nav,
    message: req.flash("notice"),
    errors: [],
  })
}

// ✅ Handle login
accountController.loginAccount = async function (req, res) {
  const { account_email, account_password } = req.body
  const nav = await utilities.getNav(res)

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Email not found.")
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email,
        message: req.flash("notice"),
      })
    }

    const match = await bcrypt.compare(account_password, accountData.account_password)

    if (!match) {
      req.flash("notice", "Incorrect password.")
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email,
        message: req.flash("notice"),
      })
    }

    const token = jwt.sign(
      {
        account_id: accountData.account_id,
        account_email: accountData.account_email,
        account_type: accountData.account_type,
        account_firstname: accountData.account_firstname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    )

    res.cookie("jwt", token, { httpOnly: true })
    req.session.account = accountData

    req.flash("notice", "Login successful.")
    res.redirect("/account/")
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login failed. Please try again.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [],
      account_email,
      message: req.flash("notice"),
    })
  }
}

// ✅ Render update form
accountController.buildUpdateForm = async function (req, res) {
  const accountId = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(accountId)
  const nav = await utilities.getNav(res)
  res.render("account/update", {
    title: "Update Account",
    nav,
    account: accountData,
    errors: [],
    message: req.flash("notice"),
  })
}

// ✅ Handle account update with validation
accountController.updateAccount = async function (req, res) {
  const accountId = parseInt(req.params.accountId)
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(res)
    const accountData = await accountModel.getAccountById(accountId)
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      account: accountData,
      errors: errors.array(),
      message: req.flash("notice"),
    })
  }

  const updateResult = await accountModel.updateAccount(
    accountId,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
  } else {
    req.flash("notice", "Update failed. Please try again.")
  }

  res.redirect(`/account/update/${accountId}`)
}

// ✅ Handle logout
accountController.accountLogout = async function (req, res) {
  res.clearCookie("jwt")
  req.session.destroy(() => {
    res.redirect("/")
  })
}

// ✅ Render feedback form
accountController.buildFeedbackForm = async function (req, res) {
  const nav = await utilities.getNav(res)
  res.render("account/feedback", {
    title: "Submit Feedback",
    nav,
    message: req.flash("notice"),
    errors: [],
  })
}

// ✅ Handle feedback submission
accountController.submitFeedback = async function (req, res) {
  const nav = await utilities.getNav(res)
  const accountId = req.session.account.account_id
  const { subject, message } = req.body

  try {
    const sql = `
      INSERT INTO feedback (account_id, subject, message)
      VALUES ($1, $2, $3)
    `
    await accountModel.query(sql, [accountId, subject, message])

    req.flash("notice", "Thank you for your feedback!")
    res.redirect("/account/")
  } catch (error) {
    console.error("Feedback submission error:", error)
    req.flash("notice", "Error submitting feedback. Please try again.")
    res.status(500).render("account/feedback", {
      title: "Submit Feedback",
      nav,
      message: req.flash("notice"),
      errors: [],
    })
  }
}

module.exports = accountController