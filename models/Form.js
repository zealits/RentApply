const mongoose = require("mongoose");

// Occupant schema for tenant's additional occupants
const OccupantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Occupant's name
  dob: { type: Date, required: true }, // Date of birth
  relationship: { type: String, required: true }, // Relationship to the tenant
});

// Employer schema for employment details
const EmployerSchema = new mongoose.Schema({
  employerName: { type: String, required: true }, // Name of employer
  occupation: { type: String, required: true }, // Occupation
  employerAddress: { type: String, required: true }, // Employer address
  employerPhone: { type: String, required: true }, // Employer's phone number
  startDate: { type: Date, required: true }, // Employment start date
  monthlyPay: { type: Number, required: true }, // Monthly pay
  supervisorName: { type: String, required: true }, // Supervisor's name
});

// Financial details schema for banking/financial information
const FinancialDetailSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Type of financial account (e.g., savings, checking)
  bank: { type: String, required: true }, // Bank name
  balance: { type: Number, required: true }, // Account balance
});

// Reference schema for tenant's references
const ReferenceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Reference's name
  phone: { type: String, required: true }, // Reference's phone number
  relationship: { type: String, required: true }, // Relationship to the tenant
});

// Background information schema for screening details
const BackgroundInfoSchema = new mongoose.Schema({
  lateRent: { type: String, required: true }, // History of late rent payments
  lawsuit: { type: String, required: true }, // History of lawsuits
  smoke: { type: String, required: true }, // Smoking habit
  pets: { type: String, required: true }, // Pet ownership
});

// Main tenant form schema
const TenantForm = new mongoose.Schema({
  step1: {
    propertyAddress: { type: String, required: true },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false},
    country: { type: String },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    socialSecurity: { type: String, required: true },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    driversLicense: { type: String, required: true },
  },
  step2: {
    occupants: [OccupantSchema], // List of occupants
    housingVoucher: { type: String }, // Housing voucher (if applicable)
    priorAddress: { type: String }, // Prior residence address
    monthlyRent: { type: Number }, // Monthly rent for prior residence
    startDate: { type: Date }, // Move-in date at prior residence
    endDate: { type: Date }, // Move-out date at prior residence
    reasonForMoving: { type: String }, // Reason for moving
    ownerManagerName: { type: String }, // Previous landlord/manager's name
    ownerManagerPhone: { type: String }, // Previous landlord/manager's phone number
  },
  step3: {
    employers: [EmployerSchema], // List of employers
  },
  step4: {
    financialDetails: [FinancialDetailSchema], // List of financial details
  },
  step5: {
    references: [ReferenceSchema], // List of references
    backgroundInfo: BackgroundInfoSchema, // Background information
  },
  step6: {
    comments: { type: String, required: false }, // Additional comments
    moveReason: { type: String, required: false }, // Reason for moving
    creditCheckComments: { type: String, required: false }, // Comments on credit check
  },
});

// Export the model
module.exports = mongoose.model("Form", TenantForm);
