const pool = require("../database")

async function submitFeedback(account_id, feedback_text) {
  const sql = `INSERT INTO feedback (account_id, feedback_text) VALUES ($1, $2)`
  return pool.query(sql, [account_id, feedback_text])
}

async function getAllFeedback() {
  const sql = `SELECT f.*, a.account_firstname FROM feedback f JOIN account a ON f.account_id = a.account_id ORDER BY submitted_at DESC`
  return pool.query(sql)
}

module.exports = { submitFeedback, getAllFeedback }