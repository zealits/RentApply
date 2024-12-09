import React, { useState } from "react";
import "./MultiStepForm.css"; // Add your custom CSS for styling
import { FaHome, FaUsers, FaBriefcase, FaWallet, FaAddressBook, FaCommentDots } from "react-icons/fa";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: <FaHome />, title: "Property & Personal Information" },
    { icon: <FaUsers />, title: "Occupants & Housing History" },
    { icon: <FaBriefcase />, title: "Employment Information" },
    { icon: <FaWallet />, title: "Financial Information" },
    { icon: <FaAddressBook />, title: "References & Background Information" },
    { icon: <FaCommentDots />, title: "Final Details & Comments" },
  ];

  const updateStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const [occupants, setOccupants] = useState([{ name: "", dob: "", relationship: "" }]);
  const [priorAddress, setPriorAddress] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reasonForMoving, setReasonForMoving] = useState("");
  const [ownerManagerDetails, setOwnerManagerDetails] = useState("");

  const addOccupant = () => {
    setOccupants([...occupants, { name: "", dob: "", relationship: "" }]);
  };

  const handleOccupantChange = (index, field, value) => {
    const updatedOccupants = [...occupants];
    updatedOccupants[index][field] = value;
    setOccupants(updatedOccupants);
  };

  const removeOccupant = (index) => {
    const updatedOccupants = occupants.filter((_, i) => i !== index);
    setOccupants(updatedOccupants);
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-content-property-info">
            <h2 className="form-title-property-info">Property & Personal Information</h2>

            <div className="form-row">
              {/* Property Address */}
              <label htmlFor="propertyAddress" className="form-label">
                Property Address
              </label>
              <input
                type="text"
                id="propertyAddress"
                name="propertyAddress"
                placeholder="Enter property address"
                className="form-input full-width"
              />
            </div>

            <div className="form-row">
              {/* First Name */}
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  className="form-input"
                />
              </div>
              {/* Middle Name */}
              <div className="form-group">
                <label htmlFor="middleName" className="form-label">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  placeholder="Enter middle name"
                  className="form-input"
                />
              </div>
              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input type="text" id="lastName" name="lastName" placeholder="Enter last name" className="form-input" />
              </div>
            </div>

            <div className="form-row">
              {/* Birth Date */}
              <div className="form-group">
                <label htmlFor="birthDate" className="form-label">
                  Birth Date
                </label>
                <input type="date" id="birthDate" name="birthDate" className="form-input" />
              </div>
              {/* Social Security */}
              <div className="form-group">
                <label htmlFor="socialSecurity" className="form-label">
                  Social Security #
                </label>
                <input
                  type="text"
                  id="socialSecurity"
                  name="socialSecurity"
                  placeholder="Enter SSN"
                  className="form-input"
                />
              </div>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="emailAddress" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="Enter email"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>
              {/* Driver's License */}
              <div className="form-group">
                <label htmlFor="driversLicense" className="form-label">
                  Driver's License #
                </label>
                <input
                  type="text"
                  id="driversLicense"
                  name="driversLicense"
                  placeholder="Enter license #"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="form-content-occupants-history">
            <h2 className="form-title-occupants-history">Occupants & Housing History</h2>

            {/* Dynamic Occupants Section */}
            <div className="form-section-occupants">
              <h3 className="form-subtitle-occupants">List of Occupants</h3>
              {occupants.map((occupant, index) => (
                <div key={index} className="occupant-entry">
                  <label className="form-label-occupant-name">
                    Name
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={occupant.name}
                      onChange={(e) => handleOccupantChange(index, "name", e.target.value)}
                      className="form-input-occupant-name"
                    />
                  </label>
                  <label className="form-label-occupant-dob">
                    Date of Birth
                    <input
                      type="date"
                      value={occupant.dob}
                      onChange={(e) => handleOccupantChange(index, "dob", e.target.value)}
                      className="form-input-occupant-dob"
                    />
                  </label>
                  <label className="form-label-occupant-relationship">
                    Relationship
                    <input
                      type="text"
                      placeholder="Enter relationship"
                      value={occupant.relationship}
                      onChange={(e) => handleOccupantChange(index, "relationship", e.target.value)}
                      className="form-input-occupant-relationship"
                    />
                  </label>
                  <button type="button" onClick={() => removeOccupant(index)} className="form-remove-occupant-btn">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOccupant} className="form-add-occupant-btn">
                Add Occupant
              </button>
            </div>

            {/* Housing Choice Voucher Program */}
            <div className="form-section-housing-voucher">
              <label htmlFor="housingVoucher" className="form-label-housing-voucher">
                Participant in the Housing Choice Voucher Program (Section 8)?
              </label>
              <select id="housingVoucher" name="housingVoucher" className="form-select-housing-voucher">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Prior Address */}
            <div className="form-section-prior-address">
              <label htmlFor="priorAddress" className="form-label-prior-address">
                Prior Address
              </label>
              <input
                type="text"
                id="priorAddress"
                name="priorAddress"
                placeholder="Enter prior address"
                value={priorAddress}
                onChange={(e) => setPriorAddress(e.target.value)}
                className="form-input-prior-address"
              />
            </div>

            {/* Monthly Rent */}
            <div className="form-section-monthly-rent">
              <label htmlFor="monthlyRent" className="form-label-monthly-rent">
                Monthly Rent
              </label>
              <input
                type="number"
                id="monthlyRent"
                name="monthlyRent"
                placeholder="Enter monthly rent"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="form-input-monthly-rent"
              />
            </div>

            {/* Start Date of Residency */}
            <div className="form-section-start-date">
              <label htmlFor="startDate" className="form-label-start-date">
                Start Date of Residency
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input-start-date"
              />
            </div>

            {/* End Date of Residency */}
            <div className="form-section-end-date">
              <label htmlFor="endDate" className="form-label-end-date">
                End Date of Residency
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input-end-date"
              />
            </div>

            {/* Reason for Moving */}
            <div className="form-section-reason-for-moving">
              <label htmlFor="reasonForMoving" className="form-label-reason-for-moving">
                Reason for Moving
              </label>
              <textarea
                id="reasonForMoving"
                name="reasonForMoving"
                placeholder="Enter reason for moving"
                value={reasonForMoving}
                onChange={(e) => setReasonForMoving(e.target.value)}
                className="form-textarea-reason-for-moving"
              ></textarea>
            </div>

            {/* Owner/Manager's Details */}
            <div className="form-section-owner-manager">
              <label htmlFor="ownerManagerDetails" className="form-label-owner-manager">
                Owner/Manager's Name & Phone Number
              </label>
              <input
                type="text"
                id="ownerManagerDetails"
                name="ownerManagerDetails"
                placeholder="Enter name and phone number"
                value={ownerManagerDetails}
                onChange={(e) => setOwnerManagerDetails(e.target.value)}
                className="form-input-owner-manager"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-content-employment-info">
            <h2 className="form-title-employment-info">Employment Information</h2>
            <label htmlFor="employerName" className="form-label-employer-name">
              Employer Name
            </label>
            <input
              type="text"
              id="employerName"
              name="employerName"
              placeholder="Enter employer name"
              className="form-input-employer-name"
            />
          </div>
        );
      case 3:
        return (
          <div className="form-content-financial-info">
            <h2 className="form-title-financial-info">Financial Information</h2>
            <label htmlFor="checkingAccount" className="form-label-checking-account">
              Checking Account
            </label>
            <input
              type="text"
              id="checkingAccount"
              name="checkingAccount"
              placeholder="Bank/Institution"
              className="form-input-checking-account"
            />
          </div>
        );
      case 4:
        return (
          <div className="form-content-references">
            <h2 className="form-title-references">References & Background Information</h2>
            <label htmlFor="references" className="form-label-references">
              References
            </label>
            <textarea
              id="references"
              name="references"
              placeholder="Name, Phone, Relationship"
              className="form-textarea-references"
            ></textarea>
          </div>
        );
      case 5:
        return (
          <div className="form-content-final-comments">
            <h2 className="form-title-final-comments">Final Details & Comments</h2>
            <label htmlFor="comments" className="form-label-comments">
              Additional Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              placeholder="Enter any additional information"
              className="form-textarea-comments"
            ></textarea>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-container-multi-step">
      {/* Stepper */}
      <div className="stepper-multi-step">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-multi-step ${index <= currentStep ? "active-step" : ""}`}
            onClick={() => updateStep(index)}
          >
            <span className={`step-icon-${index}`}>{step.icon}</span> {/* Render the icon as a React component */}
          </div>
        ))}
      </div>

      {/* Form */}
      <form id="tenantForm" className="form-multi-step">
        <div className="form-step-content">{renderFormContent()}</div>

        <div className="form-navigation-multi-step">
          {currentStep > 0 && (
            <button type="button" className="btn-prev-multi-step" onClick={() => updateStep(currentStep - 1)}>
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" className="btn-next-multi-step" onClick={() => updateStep(currentStep + 1)}>
              Next
            </button>
          ) : (
            <button type="submit" className="btn-submit-multi-step">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
