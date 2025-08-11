const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
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

/*  **********************************
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

/* ******************************
 * Check data and return errors or continue to classification addition
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
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
 * Check data and return errors or continue to inventory addition
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
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
 * Check data and return errors or continue to inventory update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
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

module.exports = validate