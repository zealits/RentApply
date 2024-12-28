const Form = require("../models/Form"); // Import the Form model

// Controller function to handle form submission
const submitForm = async (req, res) => {
    try {
    //   console.log("Incoming form data:", req.body); // Log request data
  
    //   const formData = req.body;
    //   const form = new Form(formData);
  
    //   const savedForm = await form.save();
    //   console.log("Form saved successfully:", savedForm); // Log saved data
  
    //   res.status(200).json({ message: "Form submitted successfully!", data: savedForm });
    } catch (err) {
      console.error("Error submitting form:", err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
  
      res.status(500).json({ message: "Error submitting form", error: err.message });
    }
  };

module.exports = { submitForm };
