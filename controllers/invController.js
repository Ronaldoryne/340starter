const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  ✅ Build vehicle detail view (Fixed)
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getInventoryByInventoryId(inventory_id);

    if (!data || data.length === 0) {
      req.flash("notice", "Vehicle not found.");
      return res.status(404).redirect("/inventory");
    }

    const nav = await utilities.getNav();
    const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
    const grid = await utilities.buildDetailGrid(data);

    res.render("./inventory/details", {
      title: vehicleName,
      nav,
      grid,
      vehicleDetail: data[0], // ✅ This fixes the error
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const regResult = await invModel.addClassification(classification_name);
    const nav = await utilities.getNav();

    if (regResult) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`);
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process new inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const regResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    if (regResult) {
      req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added to inventory.`);
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.");
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      res.status(501).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;