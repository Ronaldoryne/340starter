const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/inventory-validation");

// ✅ Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// ✅ Route to build vehicle detail view
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// ✅ Route to build management view
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

// ✅ Route to build add classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// ✅ Route to build add inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// ✅ Process the add classification attempt
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// ✅ Process the add inventory attempt
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// ✅ Route to get inventory data as JSON for dynamic table
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// ✅ Route to build edit inventory view
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(invController.buildEditInventoryView)
);

// ✅ ✅ ✅ Updated: Process inventory update attempt with dynamic ID
router.post(
  "/update/:inventoryId",
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// ✅ Route to build delete confirmation view
router.get(
  "/delete/:inventoryId",
  utilities.handleErrors(invController.buildDeleteInventoryView)
);

// ✅ Route to process inventory deletion
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;