// Import required modules
const FormData = require("../models/Form");
const sendEmail = require("../utils/sendEmail");

// Function to handle form submission
const submitForm = async (req, res) => {
  try {
    // Step 1: Create a new FormData instance from the request body
    const formData = new FormData(req.body);
    console.log(formData);

  
   
    // Step 6: Respond with success message
    // res.status(201).json({
    //   message: "Form submitted and email sent successfully!",
    //   data: savedData,
    // });

  } catch (error) {
    // Error handling
    console.error("Error submitting form or sending email:", error);
    res.status(500).json({ message: "Failed to submit form or send email", error: error.message });
  }
};

// Export the submitForm function
module.exports = { submitForm };