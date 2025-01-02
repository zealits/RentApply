// routes/formRoutes.js
const express = require("express");
const router = express.Router();
const { submitForm } = require("../controllers/formController"); // Import the controller

// Use the controller to handle form submission
router.post("/submit-form", submitForm);

module.exports = router;