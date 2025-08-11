const pool = require("../database/");

/* ***************************
 *  Get All Classifications
 * ************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name";
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getClassifications Error", error);
    throw error;
  }
}

/* ***************************
 *  Get Inventory by Classification Id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE classification_id = $1";
    const data = await pool.query(sql, [classification_id]);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId Error", error);
    throw error;
  }
}

/* ***************************
 *  Get Inventory by Inventory Id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById Error", error);
    throw error;
  }
}

/* ***************************
 *  Add Classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {
    console.error("addClassification Error", error);
    throw error;
  }
}

/* ***************************
 *  Add Inventory
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`;
    const data = await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("addInventory Error", error);
    throw error;
  }
}

/* ***************************
 *  Get Inventory JSON by Classification Id
 * ************************** */
async function getInventoryJSON(classification_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE classification_id = $1";
    const data = await pool.query(sql, [classification_id]);
    return JSON.stringify(data.rows);
  } catch (error) {
    console.error("getInventoryJSON Error", error);
    throw error;
  }
}

/* ***************************
 *  Update Inventory
 * ************************** */
async function updateInventory(invData) {
  try {
    const sql = `
      UPDATE inventory
      SET inv_make = $1,
          inv_model = $2,
          inv_year = $3,
          inv_description = $4,
          inv_image = $5,
          inv_thumbnail = $6,
          inv_price = $7,
          inv_miles = $8,
          inv_color = $9,
          classification_id = $10
      WHERE inv_id = $11
      RETURNING *`;
    const data = await pool.query(sql, [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
      invData.inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateInventory Error", error);
    throw error;
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rowCount; // 1 if successful, 0 if not
  } catch (error) {
    console.error("Delete Inventory Error", error);
    return 0;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  getInventoryJSON,
  updateInventory,
  deleteInventory,
};