const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

/* ***************************
 *  Build Inventory Management View
 * ************************** */
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav(res);
    const inventory = await invModel.getInventoryJSON();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      inventory,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build Add Classification View
 * ************************** */
async function buildAddClassification(req, res, next) {
  const nav = await utilities.getNav(res);
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
}

/* ***************************
 *  Build Add Inventory View
 * ************************** */
async function buildAddInventory(req, res, next) {
  const nav = await utilities.getNav(res);
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
  });
}

/* ***************************
 *  Add Classification
 * ************************** */
async function addClassification(req, res, next) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav(res);
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("notice", "Classification added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add classification.");
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Add Inventory
 * ************************** */
async function addInventory(req, res, next) {
  const invData = req.body;
  const nav = await utilities.getNav(res);
  try {
    const result = await invModel.addInventory(invData);
    if (result) {
      req.flash("notice", "Inventory item added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add inventory item.");
      res.status(500).render("inventory/add-inventory", {
        title: "Add New Inventory",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build Inventory by Classification View
 * ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  const nav = await utilities.getNav(res);
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const className = data[0]?.classification_name || "Inventory";
  res.render("inventory/classification", {
    title: `${className} Vehicles`,
    nav,
    grid,
  });
}

/* ***************************
 *  Build Inventory Detail View
 * ************************** */
async function buildByInventoryId(req, res, next) {
  const inventoryId = req.params.inventoryId;
  const nav = await utilities.getNav(res);
  const data = await invModel.getInventoryById(inventoryId);
  const detail = await utilities.buildDetailView(data);
  const itemName = `${data.inv_make} ${data.inv_model}`;
  res.render("inventory/detail", {
    title: itemName,
    nav,
    detail,
  });
}

/* ***************************
 *  Get Inventory JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = req.params.classification_id;
  const data = await invModel.getInventoryJSON(classification_id);
  res.json(data);
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
async function buildEditInventoryView(req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav(res);
  const inventoryData = await invModel.getInventoryById(inv_id);
  const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: `Edit ${itemName}`,
    nav,
    errors: null,
    inventory: inventoryData,
  });
}

/* ***************************
 *  ✅ Updated: Process Inventory Update
 * ************************** */
async function updateInventory(req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);
  const invData = { ...req.body, inv_id };
  const nav = await utilities.getNav(res);

  try {
    const updateResult = await invModel.updateInventory(invData);
    if (updateResult) {
      req.flash("notice", "Inventory item updated successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Update failed.");
      res.redirect(`/inv/edit/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
async function buildDeleteInventoryView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav(res);
    const inventoryData = await invModel.getInventoryById(inv_id);

    if (!inventoryData) {
      req.flash("notice", "Inventory item not found.");
      return res.redirect("/inv");
    }

    const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

    res.render("inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inventory: inventoryData,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Delete Inventory
 * ************************** */
async function deleteInventory(req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
      req.flash("notice", "Inventory item successfully deleted.");
      return res.redirect("/inv");
    } else {
      req.flash("notice", "Delete failed. Please try again.");
      return res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildManagement,
  buildAddClassification,
  buildAddInventory,
  addClassification,
  addInventory,
  buildByClassificationId,
  buildByInventoryId,
  getInventoryJSON,
  buildEditInventoryView,
  updateInventory,
  buildDeleteInventoryView,
  deleteInventory,
};