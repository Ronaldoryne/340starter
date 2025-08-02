const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")

// Route to intentionally trigger an error for testing
router.get("/", utilities.handleErrors(async (req, res, next) => {
  const error = new Error("This is an intentional 500 error for testing purposes.")
  error.status = 500
  throw error
}))

// Route to test 404 error
router.get("/404", utilities.handleErrors(async (req, res, next) => {
  const error = new Error("This page was not found.")
  error.status = 404
  throw error
}))

module.exports = router