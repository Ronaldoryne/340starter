const express = require("express")
const router = express.Router()
const feedbackController = require("../controllers/feedbackController")
const { body } = require("express-validator")
const utilities = require("../utilities")

router.get("/feedback", utilities.handleErrors(feedbackController.buildFeedbackForm))

router.post(
  "/feedback",
  body("feedback_text").trim().notEmpty().withMessage("Feedback cannot be empty."),
  utilities.handleErrors(feedbackController.submitFeedback)
)

router.get("/feedback-dashboard", utilities.handleErrors(feedbackController.viewFeedbackDashboard))

module.exports = router