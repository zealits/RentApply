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
  const [ownerManagerName, setOwnerManagerName] = useState("");
  const [ownerManagerPhone, setOwnerManagerPhone] = useState("");

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

  const [employers, setEmployers] = useState([
    {
      employerName: "",
      occupation: "",
      employerAddress: "",
      employerPhone: "",
      startDate: "",
      supervisorName: "",
      monthlyPay: "",
    },
  ]);

  const addEmployer = () => {
    setEmployers([
      ...employers,
      {
        employerName: "",
        occupation: "",
        employerAddress: "",
        employerPhone: "",
        startDate: "",
        supervisorName: "",
        monthlyPay: "",
      },
    ]);
  };

  const handleEmployerChange = (index, field, value) => {
    const updatedEmployers = [...employers];
    updatedEmployers[index][field] = value;
    setEmployers(updatedEmployers);
  };

  const removeEmployer = (index) => {
    const updatedEmployers = employers.filter((_, i) => i !== index);
    setEmployers(updatedEmployers);
  };

  const [financialDetails, setFinancialDetails] = useState([{ type: "Checking Account", bank: "", balance: "" }]);

  const addFinancialDetail = () => {
    setFinancialDetails([...financialDetails, { type: "", bank: "", balance: "" }]);
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...financialDetails];
    updatedDetails[index][field] = value;
    setFinancialDetails(updatedDetails);
  };

  const removeFinancialDetail = (index) => {
    const updatedDetails = financialDetails.filter((_, i) => i !== index);
    setFinancialDetails(updatedDetails);
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
                  <div className="occupant-row">
                    <label className="form-label">
                      Name
                      <input
                        type="text"
                        placeholder="Enter name"
                        value={occupant.name}
                        onChange={(e) => handleOccupantChange(index, "name", e.target.value)}
                        className="form-input"
                      />
                    </label>
                    <label className="form-label">
                      Date of Birth
                      <input
                        type="date"
                        value={occupant.dob}
                        onChange={(e) => handleOccupantChange(index, "dob", e.target.value)}
                        className="form-input"
                      />
                    </label>
                    <label className="form-label">
                      Relationship
                      <input
                        type="text"
                        placeholder="Enter relationship"
                        value={occupant.relationship}
                        onChange={(e) => handleOccupantChange(index, "relationship", e.target.value)}
                        className="form-input"
                      />
                    </label>
                    <button type="button" onClick={() => removeOccupant(index)} className="form-remove-btn">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addOccupant} className="form-add-btn">
                Add Occupant
              </button>
            </div>

            {/* Housing Choice Voucher Program */}
            <div className="form-row">
              <label className="form-label">
                Participant in Housing Choice Voucher Program?
                <select name="housingVoucher" className="form-select">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="form-label">
                Prior Address
                <input
                  type="text"
                  name="priorAddress"
                  placeholder="Enter prior address"
                  value={priorAddress}
                  onChange={(e) => setPriorAddress(e.target.value)}
                  className="form-input"
                />
              </label>
            </div>

            {/* Monthly Rent */}
            <div className="form-row">
              <label className="form-label">
                Monthly Rent
                <input
                  type="number"
                  name="monthlyRent"
                  placeholder="Enter monthly rent"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Start Date of Residency
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                End Date of Residency
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </label>
            </div>

            {/* Reason for Moving */}
            <div className="form-row">
              <label className="form-label">
                Reason for Moving
                <textarea
                  name="reasonForMoving"
                  placeholder="Enter reason for moving"
                  value={reasonForMoving}
                  onChange={(e) => setReasonForMoving(e.target.value)}
                  className="form-textarea"
                ></textarea>
              </label>
            </div>

            {/* Owner/Manager's Details */}
            <div className="form-row">
              <label className="form-label">
                Owner/Manager's Name
                <input
                  type="text"
                  name="ownerManagerName"
                  placeholder="Enter owner's/manager's name"
                  value={ownerManagerName}
                  onChange={(e) => setOwnerManagerName(e.target.value)}
                  className="form-input"
                />
              </label>
              <label className="form-label">
                Phone Number
                <input
                  type="tel"
                  name="ownerManagerPhone"
                  placeholder="Enter phone number"
                  value={ownerManagerPhone}
                  onChange={(e) => setOwnerManagerPhone(e.target.value)}
                  className="form-input"
                />
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-content-employment-info">
            <h2 className="form-title-employment-info">Employment Information</h2>
            {employers.map((employer, index) => (
              <div key={index} className="employer-entry">
                <div className="form-row">
                  <label className="form-label">
                    Employer Name
                    <input
                      type="text"
                      placeholder="Enter employer name"
                      value={employer.employerName}
                      onChange={(e) => handleEmployerChange(index, "employerName", e.target.value)}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    Occupation
                    <input
                      type="text"
                      placeholder="Enter occupation"
                      value={employer.occupation}
                      onChange={(e) => handleEmployerChange(index, "occupation", e.target.value)}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    Employer Address
                    <input
                      type="text"
                      placeholder="Enter employer address"
                      value={employer.employerAddress}
                      onChange={(e) => handleEmployerChange(index, "employerAddress", e.target.value)}
                      className="form-input"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Employer Phone
                    <input
                      type="tel"
                      placeholder="Enter employer phone"
                      value={employer.employerPhone}
                      onChange={(e) => handleEmployerChange(index, "employerPhone", e.target.value)}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    Start Date of Employment
                    <input
                      type="date"
                      value={employer.startDate}
                      onChange={(e) => handleEmployerChange(index, "startDate", e.target.value)}
                      className="form-input"
                    />
                  </label>
                  <label className="form-label">
                    Monthly Pay
                    <input
                      type="number"
                      placeholder="Enter monthly pay"
                      value={employer.monthlyPay}
                      onChange={(e) => handleEmployerChange(index, "monthlyPay", e.target.value)}
                      className="form-input"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Name of Supervisor
                    <input
                      type="text"
                      placeholder="Enter supervisor's name"
                      value={employer.supervisorName}
                      onChange={(e) => handleEmployerChange(index, "supervisorName", e.target.value)}
                      className="form-input"
                    />
                  </label>
                </div>

                {employers.length > 1 && (
                  <button type="button" onClick={() => removeEmployer(index)} className="form-remove-employer-btn">
                    Remove Employer
                  </button>
                )}
                <hr />
              </div>
            ))}
            <button type="button" onClick={addEmployer} className="form-add-employer-btn">
              Add Employer
            </button>
          </div>
        );
      case 3:
        return (
            <div className="form-content-financial-info">
            <h2 className="form-title-financial-info">Financial Information</h2>
            {financialDetails.map((detail, index) => (
              <div key={index} className="financial-detail-row">
                <div className="form-group">
                  <label htmlFor={`type-${index}`} className="form-label">
                    Financial Type
                  </label>
                  <select
                    id={`type-${index}`}
                    name={`type-${index}`}
                    value={detail.type}
                    onChange={(e) => handleDetailChange(index, "type", e.target.value)}
                    className="form-input"
                  >
                    <option value="Checking Account">Checking Account</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Auto Loan">Auto Loan</option>
                    <option value="Additional Debt">Additional Debt</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`bank-${index}`} className="form-label">
                    Bank/Institution
                  </label>
                  <input
                    type="text"
                    id={`bank-${index}`}
                    name={`bank-${index}`}
                    placeholder="Enter bank/institution"
                    value={detail.bank}
                    onChange={(e) => handleDetailChange(index, "bank", e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`balance-${index}`} className="form-label">
                    Balance
                  </label>
                  <input
                    type="number"
                    id={`balance-${index}`}
                    name={`balance-${index}`}
                    placeholder="Enter balance"
                    value={detail.balance}
                    onChange={(e) => handleDetailChange(index, "balance", e.target.value)}
                    className="form-input"
                  />
                </div>
                {financialDetails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFinancialDetail(index)}
                    className="form-remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addFinancialDetail} className="form-add-btn">
              Add Financial Detail
            </button>
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
