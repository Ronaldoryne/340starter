const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters."),
  ]
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make name."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model name."),

    body("inv_year")
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid 4-digit year."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .isNumeric()
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .isNumeric()
      .withMessage("Please provide valid mileage."),

    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),

    body("classification_id")
      .isNumeric()
      .withMessage("Please select a classification."),
  ]
}

/* **********************************
 *  Account Registration Validation Rules
 * ********************************* */
validate.accountRegistrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[!@#$%^&*]/)
      .withMessage("Password must contain at least one special character."),
  ]
}

/* **********************************
 *  Account Login Validation Rules
 * ********************************* */
validate.accountLoginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter your password."),
  ]
}

/* **********************************
 *  Account Update Validation Rules
 * ********************************* */
validate.accountUpdateRules = () => {
  return [
    body("firstName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("lastName")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),
  ]
}

/* **********************************
 *  Password Change Validation Rules
 * ********************************* */
validate.passwordChangeRules = () => {
  return [
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[!@#$%^&*]/)
      .withMessage("Password must contain at least one special character."),
  ]
}

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory update data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

/* ******************************
 * Check account registration data
 * ***************************** */
validate.checkAccountRegistration = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors,
      message: req.flash("notice"),
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check account login data
 * ***************************** */
validate.checkAccountLogin = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      message: req.flash("notice"),
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check account update data
 * ***************************** */
validate.checkAccountUpdate = async (req, res, next) => {
  const { accountId, firstName, lastName, email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      message: req.flash("notice"),
      account: { account_id: accountId, account_firstname: firstName, account_lastname: lastName, account_email: email },
    })
    return
  }
  next()
}

/* ******************************
 * Check password change data
 * ***************************** */
validate.checkPasswordChange = async (req, res, next) => {
  const { accountId } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await require("../models/account-model").getAccountById(accountId)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      message: req.flash("notice"),
      account: accountData,
    })
    return
  }
  next()
}

/* ******************************
 * Export all validation functions
 * ***************************** */
module.exports = validate
   