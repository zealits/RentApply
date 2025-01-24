// Import required modules
const FormData = require("../models/Form");
const sendEmail = require("../utils/sendEmail");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Function to handle form submission
const submitForm = async (req, res) => {
  try {
    // Step 1: Create a new FormData instance from the request body
    const formData = new FormData(req.body);
    console.log(formData);
    // Step 2: Save form data to MongoDB
    const savedData = await formData.save();

    let userEmailAddress;

    // Step 3: Generate Excel File
    const generateExcel = (data) => {
      // Create a workbook and worksheets for different sections
      const wb = XLSX.utils.book_new();

      userEmailAddress = data.step1.emailAddress;
      // Personal Information Worksheet
      const personalInfoSheet = XLSX.utils.json_to_sheet([
        {
          "Property Address": data.step1.propertyAddress,
          "First Name": data.step1.firstName,
          "Middle Name": data.step1.middleName || "",
          "Last Name": data.step1.lastName,
          "Date of Birth": data.step1.birthDate,
          "Social Security": data.step1.socialSecurity,
          Email: data.step1.emailAddress,
          Phone: data.step1.phoneNumber,
          "Driver's License": data.step1.driversLicense,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, personalInfoSheet, "Personal Information");

      // Occupants Worksheet
      if (data.step2.occupants && data.step2.occupants.length > 0) {
        const occupantsSheet = XLSX.utils.json_to_sheet(
          data.step2.occupants.map((occupant, index) => ({
            "Occupant Number": index + 1,
            Name: occupant.name,
            "Date of Birth": occupant.dob,
            Relationship: occupant.relationship,
          }))
        );
        XLSX.utils.book_append_sheet(wb, occupantsSheet, "Occupants");
      }

      // Housing Information Worksheet
      const housingInfoSheet = XLSX.utils.json_to_sheet([
        {
          "Prior Address": data.step2.priorAddress || "N/A",
          "Monthly Rent": data.step2.monthlyRent || "N/A",
          "Start Date": data.step2.startDate,
          "End Date": data.step2.endDate,
          "Reason for Moving": data.step2.reasonForMoving || "N/A",
        },
      ]);
      XLSX.utils.book_append_sheet(wb, housingInfoSheet, "Housing Information");

      // Employment Information Worksheet
      if (data.step3.employers && data.step3.employers.length > 0) {
        const employersSheet = XLSX.utils.json_to_sheet(
          data.step3.employers.map((employer, index) => ({
            "Employer Number": index + 1,
            "Employer Name": employer.employerName,
            Occupation: employer.occupation,
            Address: employer.employerAddress,
            Phone: employer.employerPhone,
            "Monthly Pay": employer.monthlyPay,
          }))
        );
        XLSX.utils.book_append_sheet(wb, employersSheet, "Employment Information");
      }

      // Financial Details Worksheet
      if (data.step4.financialDetails && data.step4.financialDetails.length > 0) {
        const financialSheet = XLSX.utils.json_to_sheet(
          data.step4.financialDetails.map((financial, index) => ({
            "Financial Detail Number": index + 1,
            Type: financial.type,
            Bank: financial.bank,
            Balance: financial.balance,
          }))
        );
        XLSX.utils.book_append_sheet(wb, financialSheet, "Financial Details");
      }

      // References Worksheet
      if (data.step5.references && data.step5.references.length > 0) {
        const referencesSheet = XLSX.utils.json_to_sheet(
          data.step5.references.map((reference, index) => ({
            "Reference Number": index + 1,
            Name: reference.name,
            Phone: reference.phone,
            Relationship: reference.relationship,
          }))
        );
        XLSX.utils.book_append_sheet(wb, referencesSheet, "References");
      }

      // Background Information Worksheet
      const backgroundSheet = XLSX.utils.json_to_sheet([
        {
          "Late Rent History": data.step5.backgroundInfo.lateRent,
          Smoke: data.step5.backgroundInfo.smoke,
          Pets: data.step5.backgroundInfo.pets,
          Lawsuit: data.step5.backgroundInfo.lawsuit,
        },
      ]);
      XLSX.utils.book_append_sheet(wb, backgroundSheet, "Background Information");

      // Additional Comments Worksheet
      const commentsSheet = XLSX.utils.json_to_sheet([
        {
          "Additional Comments": data.step6.comments || "No additional comments",
          "Credit Check Comments": data.step6.creditCheckComments || "No additional comments",
          "Move Reason": data.step6.moveReason || "No additional comments",
        },
      ]);
      XLSX.utils.book_append_sheet(wb, commentsSheet, "Additional Comments");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      // Save file temporarily
      const filePath = path.join(__dirname, "tenant_application.xlsx");
      fs.writeFileSync(filePath, excelBuffer);

      return filePath;
    };

    // Generate Excel file
    const excelFilePath = generateExcel(savedData);

    // Step 3: Function to generate HTML content for the emailconst
    generateEmailContent = (data) => `
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #fefefe;">

  <header style="background: #6a11cb; color: white; text-align: center; padding: 15px; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Rent Application Summary</h1>
  </header>
  
   <!-- Personal Information Section --> 
  <section style="padding: 20px; border-bottom: 1px solid #ddd;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Personal Information</h2>
    <p><strong>Property Address:</strong> ${data.step1.propertyAddress}</p>
    <p><strong>Full Name:</strong> ${data.step1.firstName} ${data.step1.middleName || ""} ${data.step1.lastName}</p>
    <p><strong>Date of Birth:</strong> ${new Date(data.step1.birthDate).toLocaleDateString()}</p>
    <p><strong>Social Security:</strong> ${data.step1.socialSecurity}</p>
    <p><strong>Email:</strong> ${data.step1.emailAddress}</p>
    <p><strong>Phone:</strong> ${data.step1.phoneNumber}</p>
    <p><strong>Driver's License:</strong> ${data.step1.driversLicense}</p>
  </section>

   <!-- Housing Information Section --> 
  <section style="padding: 20px; border-bottom: 1px solid #ddd;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Housing Information</h2>
     <h3 style="color: #6a11cb; margin-top: 20px;">Occupants</h3>
  ${
    data.step2.occupants.length > 0
      ? data.step2.occupants
          .map(
            (occupant, index) => `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
            <p><strong>Occupant ${index + 1}:</strong></p>
            <p><strong>Name:</strong> ${occupant.name}</p>
            <p><strong>Date of Birth:</strong> ${new Date(occupant.dob).toLocaleDateString()}</p>
            <p><strong>Relationship:</strong> ${occupant.relationship}</p>
          </div>
        `
          )
          .join("")
      : "<p>No occupants listed.</p>"
  }
    <p><strong>Prior Address:</strong> ${data.step2.priorAddress || "N/A"}</p>
    <p><strong>Monthly Rent:</strong> ${data.step2.monthlyRent || "N/A"}</p>
    <p><strong>Start Date:</strong> ${
      data.step2.startDate ? new Date(data.step2.startDate).toLocaleDateString() : "N/A"
    }</p>
    <p><strong>End Date:</strong> ${data.step2.endDate ? new Date(data.step2.endDate).toLocaleDateString() : "N/A"}</p>
    <p><strong>Reason for Moving:</strong> ${data.step2.reasonForMoving || "N/A"}</p>
  </section>

  <!-- Employment Information Section --> 
  <section style="padding: 20px; border-bottom: 1px solid #ddd;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Employment Information</h2>
    ${data.step3.employers
      .map(
        (employer, index) => `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
        <p><strong>Employer ${index + 1}:</strong> ${employer.employerName}</p>
        <p><strong>Occupation:</strong> ${employer.occupation}</p>
        <p><strong>Address:</strong> ${employer.employerAddress}</p>
        <p><strong>Phone:</strong> ${employer.employerPhone}</p>
        <p><strong>Monthly Pay:</strong> ${employer.monthlyPay}</p>
      </div>
    `
      )
      .join("")}
  </section>

   <!-- Financial Details Section --> 
  <section style="padding: 20px; border-bottom: 1px solid #ddd;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Financial Details</h2>
    ${data.step4.financialDetails
      .map(
        (financial, index) => `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
        <p><strong>Type:</strong> ${financial.type}</p>
        <p><strong>Bank:</strong> ${financial.bank}</p>
        <p><strong>Balance:</strong> ${financial.balance}</p>
      </div>
    `
      )
      .join("")}
  </section>

   <!-- References and Background Section --> 
  <section style="padding: 20px; border-bottom: 1px solid #ddd;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">References and Background</h2>
    ${data.step5.references
      .map(
        (reference, index) => `
      <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
        <p><strong>Reference ${index + 1}:</strong> ${reference.name}</p>
        <p><strong>Phone:</strong> ${reference.phone}</p>
        <p><strong>Relationship:</strong> ${reference.relationship}</p>
      </div>
    `
      )
      .join("")}
    <p><strong>Late Rent History:</strong> ${data.step5.backgroundInfo.lateRent}</p>
    <p><strong>Smoke:</strong> ${data.step5.backgroundInfo.smoke}</p>
    <p><strong>Pets:</strong> ${data.step5.backgroundInfo.pets}</p>
    <p><strong>Lawsuit:</strong> ${data.step5.backgroundInfo.lawsuit}</p>
  </section>

  <!-- Additional Comments Section --> 
  <section style="padding: 20px;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Additional Comments</h2>
    <p>${data.step6.comments || "No additional comments provided."}</p>
  </section>

   <section style="padding: 20px;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;"> negative in credit or background </h2>
    <p>${data.step6.creditCheckComments || "No additional comments provided."}</p>
  </section>

   <section style="padding: 20px;">
    <h2 style="color: #6a11cb; margin-bottom: 10px;">Reason for moving from your current address?</h2>
    <p>${data.step6.moveReason || "No additional comments provided."}</p>
  </section>

  <!-- Footer Section --> 
  <footer style="background: #6a11cb; color: white; text-align: center; padding: 15px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
  </footer>
</div>


`;
console.log("here there");

    // Step 4: Prepare email options
    // , finneypropertiesllc@gmail.com
    const emailOptions = {
      email: ["aniketkhillare172002@gmail.com", userEmailAddress], // Replace with recipient's email
      subject: "Tenant Form Submission",
      html: generateEmailContent(savedData),
      attachments: [
        {
          filename: "tenant_application.xlsx",
          path: excelFilePath,
        },
      ],
    };

    // Step 5: Send email
    await sendEmail(emailOptions);

    // Step 6: Clean up temporary file
    fs.unlinkSync(excelFilePath);

    // Step 6: Respond with success message
    res.status(201).json({
      message: "Form submitted and email sent successfully!",
      data: savedData,
    });
  } catch (error) {
    // Error handling
    console.error("Error submitting form or sending email:", error);
    res.status(500).json({ message: "Failed to submit form or send email", error: error.message });
  }
};

// Export the submitForm function
module.exports = { submitForm };
