const mongoose = require('mongoose');
// const FormData = require("../models/Form"); 

// Define the form schema
const formDataSchema = new mongoose.Schema({
  step1: {
    propertyAddress: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    socialSecurity: { type: String, required: true },
    emailAddress: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
    phoneNumber: { type: String, required: true },
    driversLicense: { type: String, required: true },
  },
  step2: {
    occupants: [
      {
        name: { type: String, required: true },
        dob: { type: Date, required: true },
        relationship: { type: String, required: true },
      },
    ],
    housingVoucher: { type: String },
    priorAddress: { type: String },
    monthlyRent: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    reasonForMoving: { type: String },
    ownerManagerName: { type: String },
    ownerManagerPhone: { type: String },
  },
  step3: {
    employers: [
      {
        employerName: { type: String, required: true },
        occupation: { type: String, required: true },
        employerAddress: { type: String, required: true },
        employerPhone: { type: String, required: true },
        startDate: { type: Date, required: true },
        monthlyPay: { type: Number, required: true },
        supervisorName: { type: String, required: true },
      },
    ],
  },
  step4: {
    financialDetails: [
      {
        type: { type: String, required: true },
        bank: { type: String, required: true },
        balance: { type: Number, required: true },
      },
    ],
  },
  step5: {
    references: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relationship: { type: String, required: true },
      },
    ],
    backgroundInfo: {
      lateRent: { type: String },
      lawsuit: { type: String },
      smoke: { type: String },
      pets: { type: String },
    },
  },
  step6: {
    comments: { type: String },
  },
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps to the schema
});

// console.log("Received Form Data:", req.body);


// Create the model using the schema
module.exports = mongoose.model('Form', formDataSchema);
