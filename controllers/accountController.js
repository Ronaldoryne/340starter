const utilities = require("../utilities")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let message = req.flash("message") // ✅ Add this to retrieve any flash messages
  res.render("account/login", {
    title: "Login",
    nav,
    message, // ✅ Pass message to the view
    errors: null,
  })
}

module.exports = {
  buildLogin,
}
