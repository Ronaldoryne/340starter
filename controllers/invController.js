
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by inventory ID
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getInventoryById(inv_id)
  if (data) {
    const grid = await utilities.buildVehicleDetailHTML(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      grid,
    })
  } else {
    const err = new Error('Vehicle not found')
    err.status = 404
    next(err)
  }
}

/* ***************************
 *  Intentionally trigger a 500 error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const error = new Error('This is an intentional 500 error for testing purposes')
  error.status = 500
  throw error
}

module.exports = invCont