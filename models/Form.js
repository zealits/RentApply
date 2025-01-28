const mongoose = require("mongoose"); 

const OccupantSchema = new mongoose.Schema({
  name: { type: String  },
  dob: { type: Date },
  relationship: { type: String},
});

const EmployerSchema = new mongoose.Schema({
  employerName: { type: String },
  occupation: { type: String },
  employerAddress: { type: String },
  employerPhone: { type: String },
  startDate: { type: Date },
  monthlyPay: { type: Number },
  supervisorName: { type: String },
});

const FinancialDetailSchema = new mongoose.Schema({
  type: { type: String },
  bank: { type: String },
  balance: { type: Number },
});

const ReferenceSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  relationship: { type: String },
});

const BackgroundInfoSchema = new mongoose.Schema({
  lateRent: { type: String },
  lawsuit: { type: String },
  smoke: { type: String },
  pets: { type: String },
});

const TenantForm = new mongoose.Schema({
  step1: {
    propertyAddress: { type: String }, // Full property address
    streetAddressAbbreviation: { type: String },      // Optional street address abbreviation
    city: { type: String },           // City of the property
    state: { type: String },          // State (e.g. DC)
    zipCode: { type: String },        // ZIP Code
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date },
    socialSecurity: { type: String },
    emailAddress: { type: String },
    phoneNumber: { type: String },
    driversLicense: { type: String },
  },
  step2: {
    occupants: [OccupantSchema],
    housingVoucher: { type: String },
    priorAddress: { type: String },
    monthlyRent: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    reasonForMoving: { type: String },
    ownerManagerName: { type: String },
    ownerManagerPhone: { type: String },
  },
  step3: {
    employers: [EmployerSchema],
  },
  step4: {
    financialDetails: [FinancialDetailSchema],
  },
  step5: {
    references: [ReferenceSchema],
    backgroundInfo: BackgroundInfoSchema,
  },
  step6: {
    comments: { type: String, required: false },  // Updated: added field for user comments
    moveReason: { type: String, required: false }, // Optional field for the reason for moving
    creditCheckComments: { type: String, required: false },  // Optional field for credit check comments
    receiptUrl: { type: String, required: false },  // Optional field for credit check comments
    paymentID: { type: String, required: false },  // Optional field for credit check comments
  },
});

module.exports = mongoose.model("Form", TenantForm);
