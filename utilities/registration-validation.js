// utilities/registration-validation.js
const { body, validationResult } = require("express-validator")
const regValidate = {}

// Registration validation rules
regValidate.registrationRules = () => {
  return [
    body("firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),
    body("lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be 12+ characters and contain upper/lowercase, number, and special character."),
  ]
}

// Check registration data and return errors or continue
regValidate.checkRegData = async (req, res, next) => {
  const { firstname, lastname, email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await require("./index").getNav()
    res.render("account/register", {
      errors,
      title: "Register",
      nav,
      firstname,
      lastname,
      email,
    })
    return
  }
  next()
}

module.exports = regValidate
