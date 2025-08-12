const feedbackModel = require("../models/feedbackModel")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")

const feedbackController = {}

feedbackController.buildFeedbackForm = async function (req, res) {
  const nav = await utilities.getNav(res)
  res.render("account/feedback", {
    title: "Submit Feedback",
    nav,
    errors: [],
    message: req.flash("notice"),
  })
}

feedbackController.submitFeedback = async function (req, res) {
  const nav = await utilities.getNav(res)
  const errors = validationResult(req)
  const account_id = req.session.account.account_id
  const { feedback_text } = req.body

  if (!errors.isEmpty()) {
    return res.render("account/feedback", {
      title: "Submit Feedback",
      nav,
      errors: errors.array(),
      message: req.flash("notice"),
    })
  }

  await feedbackModel.submitFeedback(account_id, feedback_text)
  req.flash("notice", "Thank you for your feedback!")
  res.redirect("/account/feedback")
}

feedbackController.viewFeedbackDashboard = async function (req, res) {
  const nav = await utilities.getNav(res)
  const feedback = await feedbackModel.getAllFeedback()
  res.render("account/feedback-dashboard", {
    title: "Feedback Dashboard",
    nav,
    feedback: feedback.rows,
    message: req.flash("notice"),
  })
}

module.exports = feedbackController