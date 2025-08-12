const bcrypt = require("bcryptjs")

const pool = require("./database")
async function fixPasswords() {
  try {
    const result = await pool.query("SELECT account_id, account_password FROM account")
    for (let row of result.rows) {
      const pw = row.account_password
      if (!pw.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(pw, 10)
        await pool.query("UPDATE account SET account_password = $1 WHERE account_id = $2", [hashed, row.account_id])
        console.log(`✅ Updated password for account ${row.account_id}`)
      } else {
        console.log(`🔒 Already hashed: account ${row.account_id}`)
      }
    }
    console.log("✅ All passwords checked.")
  } catch (err) {
    console.error("❌ Error:", err.message)
  }
}

fixPasswords()