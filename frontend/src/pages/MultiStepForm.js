import React, { useState, useEffect } from "react";
import "./MultiStepForm.css"; // Add your custom CSS for styling
import { FaHome, FaUsers, FaBriefcase, FaWallet, FaAddressBook, FaCommentDots, FaMoneyCheckAlt } from "react-icons/fa";
import MyPaymentForm from "../components/MyPaymentForm.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Popup from "../components/Popup.js";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [card, setCard] = useState(null);
  const [isMasked, setIsMasked] = useState(true); // Define isMasked state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    let isInitialized = false;
    async function initializePayments() {
      if (isInitialized) return;
      const payments = window.Square.payments(
        "sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ", // Replace with your Square Application ID
        "L0TCSMSRY7SEA}" // Replace with your Location ID
      );

      const cardInstance = await payments.card();

      // Check if card instance is already attached
      if (!document.querySelector("#card-container div")) {
        await cardInstance.attach("#card-container");
      }
      console.log(cardInstance);
      setCard(cardInstance); // Store the card instance in state
      isInitialized = true;
    }

    initializePayments();
  }, []);

  const handlePayment = async () => {
    console.log("sdfdsf");
    if (!card) {
      alert("Payment form is not ready. Please try again later.");
      return;
    }

    const result = await card.tokenize();

    console.log("dfdf", result);

    if (result.status === "OK") {
      try {
        // Send the token to your backend  http://localhost:1212/api/submit-form
        const paymentResponse = await fetch("/api/payments/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: 1000, // Replace with the actual amount in cents
          }),
        });

        const paymentResult = await paymentResponse.json();
        if (paymentResult.error) {
          alert("Payment failed: " + paymentResult.error);
        } else {
          alert("Payment successful!");
        }
      } catch (error) {
        alert("Error processing payment: " + error.message);
      }
    } else {
      alert("Tokenization failed!");
    }
  };

  const [formData, setFormData] = useState({
    step1: {
      propertyAddress: "", // Full property address (Street, City, State, ZIP code)
      streetAddressAbbreviation: "", // Optional: street address abbreviation (e.g., Ave NW, Blvd)
      city: "", // City of the property
      state: "", // State of the property (e.g., DC, CA)
      zipCode: "", // ZIP code of the property
      firstName: "", // Tenant's first name
      middleName: "", // Tenant's middle name (optional)
      lastName: "", // Tenant's last name
      birthDate: "", // Tenant's birth date
      socialSecurity: "", // Tenant's social security number
      maskedSocialSecurity: "",
      emailAddress: "", // Tenant's email address
      phoneNumber: "", // Tenant's phone number
      driversLicense: "", // Tenant's driver's license number
    },
    step2: {
      occupants: [{ name: "", lastName: "", dob: "", relationship: "" }],
      housingVoucher: "no",
      priorAddress: "",
      monthlyRent: "",
      startDate: "",
      endDate: "",
      reasonForMoving: "",
      ownerManagerName: "",
      ownerManagerPhone: "",
    },
    step3: {
      employers: [
        {
          employerName: "",
          occupation: "",
          employerAddress: "",
          employerPhone: "",
          startDate: "",
          monthlyPay: "",
          supervisorName: "",
        },
      ],
    },
    step4: {
      financialDetails: [{ type: "Checking Account", bank: "", balance: "" }],
    },
    step5: {
      references: [{ name: "", phone: "", relationship: "" }],
      backgroundInfo: {
        lateRent: "",
        lawsuit: "",
        smoke: "",
        pets: "",
      },
    },
    step6: {
      comments: "",
      moveReason: "", // Store the reason for moving
      creditCheckComments: "", // Store comments regarding credit/background check
    },
  });

  // below for step 2
  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleOccupantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedOccupants = [...prev.step2.occupants];
      updatedOccupants[index][field] = value;
      return {
        ...prev,
        step2: { ...prev.step2, occupants: updatedOccupants },
      };
    });
  };

  const addOccupant = () => {
    setFormData({
      ...formData,
      step2: {
        ...formData.step2,
        occupants: [
          ...formData.step2.occupants,
          { name: "", lastName: "", dob: "", relationship: "" }, // Default values
        ],
      },
    });
  };

  const removeOccupant = (index) => {
    const updatedOccupants = [...formData.step2.occupants];
    updatedOccupants.splice(index, 1);
    setFormData({
      ...formData,
      step2: {
        ...formData.step2,
        occupants: updatedOccupants,
      },
    });
  };

  // above for step 2

  //  below for step 3

  const handleEmployerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedEmployers = [...prev.step3.employers];
      updatedEmployers[index][field] = value;
      return {
        ...prev,
        step3: { ...prev.step3, employers: updatedEmployers },
      };
    });
  };

  const addEmployer = () => {
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        employers: [
          ...prev.step3.employers,
          {
            employerName: "",
            occupation: "",
            employerAddress: "",
            employerPhone: "",
            startDate: "",
            monthlyPay: "",
            supervisorName: "",
          },
        ],
      },
    }));
  };

  const removeEmployer = (index) => {
    setFormData((prev) => {
      const updatedEmployers = prev.step3.employers.filter((_, i) => i !== index);
      return {
        ...prev,
        step3: { ...prev.step3, employers: updatedEmployers },
      };
    });
  };

  // above for step 3

  // below for step 4

  const handleDetailChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDetails = [...prev.step4.financialDetails];
      updatedDetails[index][field] = value;
      return {
        ...prev,
        step4: { ...prev.step4, financialDetails: updatedDetails },
      };
    });
  };

  const addFinancialDetail = () => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        financialDetails: [...prev.step4.financialDetails, { type: "Checking Account", bank: "", balance: "" }],
      },
    }));
  };

  const removeFinancialDetail = (index) => {
    setFormData((prev) => {
      const updatedDetails = prev.step4.financialDetails.filter((_, i) => i !== index);
      return {
        ...prev,
        step4: { ...prev.step4, financialDetails: updatedDetails },
      };
    });
  };

  // above for step 4

  // below for step 5

  const handleReferenceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedReferences = [...prev.step5.references];
      updatedReferences[index][field] = value;
      return {
        ...prev,
        step5: { ...prev.step5, references: updatedReferences },
      };
    });
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      step5: {
        ...prev.step5,
        references: [...prev.step5.references, { name: "", phone: "", relationship: "" }],
      },
    }));
  };

  const removeReference = (index) => {
    setFormData((prev) => {
      const updatedReferences = prev.step5.references.filter((_, i) => i !== index);
      return {
        ...prev,
        step5: { ...prev.step5, references: updatedReferences },
      };
    });
  };

  const handleBackgroundChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      step5: {
        ...prev.step5,
        backgroundInfo: { ...prev.step5.backgroundInfo, [field]: value },
      },
    }));
  };

  // above for step 5

  // below for step 6
  const handleCommentsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      step6: { ...prev.step6, comments: value },
    }));
  };

  const handleInputChange = (e) => {
    const input = e.target.value;

    // Allow only numeric characters and limit to 9 digits
    const sanitizedInput = input.replace(/\D/g, "").slice(0, 9);

    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, socialSecurity: sanitizedInput },
    }));
  };

  const prepareFormData = () => {
    const preparedData = { ...formData };

    // Convert monthlyRent to a number
    if (preparedData.step2.monthlyRent) {
      preparedData.step2.monthlyRent = parseFloat(preparedData.step2.monthlyRent);
    }

    // Convert balances in financialDetails to numbers
    preparedData.step4.financialDetails = preparedData.step4.financialDetails.map((detail) => ({
      ...detail,
      balance: parseFloat(detail.balance) || 0,
    }));

    return preparedData;
  };

  const [errors, setErrors] = useState({
    socialSecurity: "",
  });

  const validate = () => {
    const newErrors = {};
    const { step1 } = formData;

    // Validate required fields
    if (!step1.propertyAddress.trim()) {
      newErrors.propertyAddress = "Property Address is required.";
    }
    if (!step1.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!step1.state.trim()) {
      newErrors.state = "State is required.";
    }
    const { socialSecurity } = formData.step1;

    if (!socialSecurity) {
      newErrors.socialSecurity = "Social Security Number is required.";
    } else if (socialSecurity.length !== 9) {
      newErrors.socialSecurity = "Social Security Number must be exactly 9 digits.";
    }

    if (!step1.zipCode.trim()) {
      newErrors.zipCode = "ZIP Code is required.";
    } else if (!/^\d{5}$/.test(step1.zipCode)) {
      // Validate ZIP Code format (5 digits)
      newErrors.zipCode = "Invalid ZIP Code format.";
    }

    // Optionally validate Street Address Abbreviation if it's provided
    // if (step1.streetAddressAbbreviation && !/^[A-Za-z\s.]+$/.test(step1.streetAddressAbbreviation)) {
    //   newErrors.streetAddressAbbreviation = "Invalid Street Address Abbreviation format.";
    // }

    if (!step1.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    }
    if (!step1.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    }

    // Validate Birth Date (required and format: YYYY-MM-DD)
    if (!step1.birthDate.trim()) {
      newErrors.birthDate = "Birth Date is required.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(step1.birthDate)) {
      newErrors.birthDate = "Invalid Birth Date format. Use YYYY-MM-DD.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time part for comparison
      const enteredDate = new Date(step1.birthDate);

      if (enteredDate > today) {
        newErrors.birthDate = "Birth Date cannot be in the future.";
      }
    }

    if (!step1.emailAddress.trim()) {
      newErrors.emailAddress = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(step1.emailAddress)) {
      newErrors.emailAddress = "Invalid Email Address.";
    }

    // Validate Phone Number
    const flexiblePhoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    if (!step1.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!flexiblePhoneRegex.test(step1.phoneNumber)) {
      newErrors.phoneNumber =
        "Invalid phone number. Use formats like (123) 456-7890, 123-456-7890, or +1 123 456 7890.";
    }

    if (!step1.driversLicense.trim()) {
      newErrors.driversLicense = "Driver's License is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDisplayValue = () => {
    const { socialSecurity } = formData.step1;
    if (isMasked) {
      return socialSecurity.replace(/./g, "*"); // Mask all digits with *
    }
    return socialSecurity; // Show raw value if unmasked
  };

  const validateCase1 = () => {
    const newErrors = {};
    const { step2 } = formData;

    step2.occupants.forEach((occupant, index) => {
      if (!occupant.name.trim()) {
        newErrors[`occupantName-${index}`] = "First Name is required.";
      }
      if (!occupant.lastName.trim()) {
        newErrors[`occupantLastName-${index}`] = "Last Name is required.";
      }
      if (!occupant.dob.trim()) {
        newErrors[`occupantDob-${index}`] = "Date of Birth is required.";
      }
      if (!occupant.relationship.trim()) {
        newErrors[`occupantRelationship-${index}`] = "Relationship is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCase2 = () => {
    const newErrors = {};
    const { step3 } = formData;

    step3.employers.forEach((employer, index) => {
      if (!employer.employerName.trim()) {
        newErrors[`employerName-${index}`] = "Employer Name is required.";
      }
      if (!employer.occupation.trim()) {
        newErrors[`occupation-${index}`] = "Occupation is required.";
      }
      if (!employer.employerAddress.trim()) {
        newErrors[`employerAddress-${index}`] = "Employer Address is required.";
      }
      if (!employer.employerPhone.trim()) {
        newErrors[`employerPhone-${index}`] = "Employer Phone is required.";
      }
      if (!employer.startDate.trim()) {
        newErrors[`startDate-${index}`] = "Start Date is required.";
      }
      if (!employer.monthlyPay.trim()) {
        newErrors[`monthlyPay-${index}`] = "Monthly Pay is required.";
      }
      if (!employer.supervisorName.trim()) {
        newErrors[`supervisorName-${index}`] = "Supervisor's Name is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCase3 = () => {
    const newErrors = {};
    formData.step4.financialDetails.forEach((detail, index) => {
      if (!detail.type.trim()) {
        newErrors[`type-${index}`] = "Financial Type is required.";
      }
      if (!detail.bank.trim()) {
        newErrors[`bank-${index}`] = "Bank/Institution is required.";
      }
      if (!detail.balance || isNaN(detail.balance) || detail.balance <= 0) {
        newErrors[`balance-${index}`] = "Valid Balance is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCase4 = () => {
    const newErrors = {};

    // Validate References
    formData.step5.references.forEach((reference, index) => {
      if (!reference.name.trim()) {
        newErrors[`reference-name-${index}`] = "Name is required.";
      }
      if (!reference.phone.trim()) {
        newErrors[`reference-phone-${index}`] = "Valid phone number is required (10 digits).";
      }
      if (!reference.relationship.trim()) {
        newErrors[`reference-relationship-${index}`] = "Relationship is required.";
      }
    });

    // Validate Background Information
    if (!formData.step5.backgroundInfo.lateRent) {
      newErrors.lateRent = "Please select an option for late rent.";
    }
    if (!formData.step5.backgroundInfo.lawsuit) {
      newErrors.lawsuit = "Please select an option for lawsuit.";
    }
    if (!formData.step5.backgroundInfo.smoke) {
      newErrors.smoke = "Please select an option for smoking.";
    }
    if (!formData.step5.backgroundInfo.pets) {
      newErrors.pets = "Please select an option for pets.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //comment change :
  const handleMoveReasonChange = (value) => {
    setFormData({
      ...formData,
      step6: {
        ...formData.step6,
        moveReason: value,
      },
    });
  };

  const handleCreditCheckCommentsChange = (value) => {
    setFormData({
      ...formData,
      step6: {
        ...formData.step6,
        creditCheckComments: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || !validateCase1() || !validateCase2() || !validateCase3() || !validateCase4()) {
      setPopupMessage("Please fill out all required fields correctly.");
      setShowPopup(true);
      return;
    }

    const preparedData = { ...formData };

    console.log(preparedData);

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      setPopupMessage("Form submitted successfully!");
      setShowPopup(true); // Show success message in the popup
    } catch (error) {
      setPopupMessage("Error submitting form. Please try again.");
      setShowPopup(true); // Show error message in the popup
    }
  };

  const steps = [
    { icon: <FaHome />, title: "Property & Personal Information" },
    { icon: <FaUsers />, title: "Occupants & Housing History" },
    { icon: <FaBriefcase />, title: "Employment Information" },
    { icon: <FaWallet />, title: "Financial Information" },
    { icon: <FaAddressBook />, title: "References & Background Information" },
    { icon: <FaMoneyCheckAlt />, title: "Final Details & Comments" },
  ];

  const updateStep = (step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="form-content-property-info">
            <h2 className="form-title-property-info">Personal Information</h2>

            {/* <div className="form-row">
              <div id="card-container" />
              <div onClick={handlePayment}>Pay</div>
            </div> */}

            <div className="form-row">
              {/* Personal Information Section */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="firstName" className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  className="form-input"
                  value={formData.step1.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, firstName: e.target.value },
                    }))
                  }
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              {/* Middle Name */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="middleName" className="form-label">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  placeholder="Enter middle name"
                  className="form-input"
                  value={formData.step1.middleName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, middleName: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Last Name */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="lastName" className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  className="form-input"
                  value={formData.step1.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, lastName: e.target.value },
                    }))
                  }
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* Birth Date */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="birthDate" className="form-label">
                  Birth Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className="form-input"
                  value={formData.step1.birthDate || ""}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, birthDate: e.target.value },
                    }))
                  }
                />
                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
              </div>

              {/* Social Security */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3 form-ssn">
                <label htmlFor="socialSecurity" className="form-label">
                  Social Security # <span className="required">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="socialSecurity"
                    name="socialSecurity"
                    placeholder="Enter SSN"
                    className="form-input ssn-input pr-10"
                    maxLength={9}
                    value={formData.step1.socialSecurity} // Raw input value
                    onChange={handleInputChange} // Updates state
                    style={{ WebkitTextSecurity: isMasked ? "disc" : "none" }} // Masking input
                  />

                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 ssn-button"
                    onClick={() => setIsMasked((prev) => !prev)}
                  >
                    {isMasked ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="emailAddress" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="Enter email"
                  className="form-input"
                  value={formData.step1.emailAddress || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, emailAddress: e.target.value },
                    }))
                  }
                />
                {errors.emailAddress && <span className="error-message">{errors.emailAddress}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* Phone Number */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="form-input"
                  value={formData.step1.phoneNumber || ""}
                  maxLength={14} // Limit input length to fit the format (XXX) XXX-XXXX
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                    // Format as (XXX) XXX-XXXX
                    if (value.length > 3 && value.length <= 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else if (value.length > 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, phoneNumber: value },
                    }));
                  }}
                />

                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>

              {/* Driver's License */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="driversLicense" className="form-label">
                  Driver's License # <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="driversLicense"
                  name="driversLicense"
                  placeholder="Enter license #"
                  className="form-input"
                  value={formData.step1.driversLicense || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, driversLicense: e.target.value },
                    }))
                  }
                />
                {errors.driversLicense && <span className="error-message">{errors.driversLicense}</span>}
              </div>
            </div>
            <h2 className="form-title-property-info">Address Information</h2>
            <div className="form-row">
              {/* Property Address */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="propertyAddress" className="form-label">
                  Property Address You Are Applying For <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  placeholder="Enter property address (e.g. 1600 Pennsylvania Ave NW)"
                  className="form-input"
                  value={formData.step1.propertyAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, propertyAddress: e.target.value },
                    }))
                  }
                />
                {errors.propertyAddress && <span className="error-message">{errors.propertyAddress}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* Street Address Abbreviation */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="streetAddressAbbreviation" className="form-label">
                  Street Address Abbreviation (optional)
                </label>
                <input
                  type="text"
                  id="streetAddressAbbreviation"
                  name="streetAddressAbbreviation"
                  placeholder="Optional: Ave NW, St, Blvd"
                  className="form-input"
                  value={formData.step1.streetAddressAbbreviation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: {
                        ...prev.step1,
                        streetAddressAbbreviation: e.target.value,
                      },
                    }))
                  }
                />
                {errors.streetAddressAbbreviation && (
                  <span className="error-message">{errors.streetAddressAbbreviation}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              {/* City */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="city" className="form-label">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city (e.g. Washington)"
                  className="form-input"
                  value={formData.step1.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, city: e.target.value },
                    }))
                  }
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* State */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="state" className="form-label">
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="Enter state (e.g. DC)"
                  className="form-input"
                  value={formData.step1.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, state: e.target.value },
                    }))
                  }
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
            </div>

            <div className="form-row">
              {/* ZIP Code */}
              <div className="form-group w-full sm:w-1/2 md:w-1/3">
                <label htmlFor="zipCode" className="form-label">
                  ZIP Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Enter ZIP code (e.g. 20500)"
                  className="form-input"
                  value={formData.step1.zipCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      step1: { ...prev.step1, zipCode: e.target.value },
                    }))
                  }
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
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
              {formData.step2.occupants.map((occupant, index) => (
                <div key={index} className="occupant-entry">
                  <div className="occupant-row">
                    <label className="form-label">
                      First Name<span className="required">*</span>
                      <input
                        type="text"
                        placeholder="Enter First Name"
                        value={occupant.name}
                        onChange={(e) => handleOccupantChange(index, "name", e.target.value)}
                        className={`form-input ${errors[`occupantName-${index}`] ? "input-error" : ""}`}
                      />
                      {errors[`occupantName-${index}`] && (
                        <span className="error-message">{errors[`occupantName-${index}`]}</span>
                      )}
                    </label>

                    <label className="form-label">
                      Last Name<span className="required">*</span>
                      <input
                        type="text"
                        placeholder="Enter Last Name"
                        value={occupant.lastName} // Ensure this is correctly linked to the state
                        onChange={(e) => handleOccupantChange(index, "lastName", e.target.value)} // Update 'lastName' properly
                        className={`form-input ${errors[`occupantLastName-${index}`] ? "input-error" : ""}`}
                      />
                      {errors[`occupantLastName-${index}`] && (
                        <span className="error-message">{errors[`occupantLastName-${index}`]}</span>
                      )}
                    </label>

                    <label className="form-label">
                      Date of Birth<span className="required">*</span>
                      <input
                        type="date"
                        value={occupant.dob}
                        max={new Date().toISOString().split("T")[0]} // Disallows future dates
                        onChange={(e) => handleOccupantChange(index, "dob", e.target.value)}
                        className={`form-input ${errors[`occupantDob-${index}`] ? "input-error" : ""}`}
                      />
                      {errors[`occupantDob-${index}`] && (
                        <span className="error-message">{errors[`occupantDob-${index}`]}</span>
                      )}
                    </label>

                    <label className="form-label">
                      Relationship<span className="required">*</span>
                      <input
                        type="text"
                        placeholder="Enter relationship"
                        value={occupant.relationship}
                        onChange={(e) => handleOccupantChange(index, "relationship", e.target.value)}
                        className={`form-input ${errors[`occupantRelationship-${index}`] ? "input-error" : ""}`}
                      />
                      {errors[`occupantRelationship-${index}`] && (
                        <span className="error-message">{errors[`occupantRelationship-${index}`]}</span>
                      )}
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
                Participant in Housing Choice Voucher Program{" "}
                <a href="https://www.usa.gov/housing-voucher-section-8" className="section8">
                  (Section 8)
                </a>
                ?
                <select
                  name="housingVoucher"
                  value={formData.step2.housingVoucher}
                  onChange={(e) => updateFormData("step2", e.target.name, e.target.value)}
                  className="form-select"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes, I participate in the Housing Choice Voucher Program (Section 8).</option>
                  <option value="no">No, I do not participate in the Housing Choice Voucher Program.</option>
                  <option value="eligible">I am eligible but not currently participating.</option>
                  <option value="applied">I have applied but have not received assistance yet.</option>
                  <option value="past">I have received assistance in the past but am no longer participating.</option>
                </select>
              </label>
            </div>

            {/* Monthly Rent */}
            <div className="form-row">
              <label className="form-label">
                Monthly Rent
                <input
                  type="text" // Use "text" to allow manual restrictions
                  name="monthlyRent"
                  placeholder="Enter monthly rent"
                  value={formData.step2.monthlyRent}
                  onChange={(e) => {
                    // Allow only digits
                    const numericValue = e.target.value.replace(/\D/g, "");
                    updateFormData("step2", e.target.name, numericValue);
                  }}
                  className={`form-input ${errors.monthlyRent ? "input-error" : ""}`}
                />
                {errors.monthlyRent && <span className="error-message">{errors.monthlyRent}</span>}
              </label>

              <label className="form-label">
                Start Date of Residency
                <input
                  type="date"
                  name="startDate"
                  value={formData.step2.startDate}
                  max={new Date().toISOString().split("T")[0]} // Disallows future dates
                  onChange={(e) => {
                    updateFormData("step2", e.target.name, e.target.value);
                  }}
                  className={`form-input ${errors.startDate ? "input-error" : ""}`}
                />
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </label>

              <label className="form-label">
                End Date of Residency
                <input
                  type="date"
                  name="endDate"
                  value={formData.step2.endDate}
                  min={formData.step2.startDate || ""} // Ensures end date is not before start date
                  max={new Date().toISOString().split("T")[0]} // Disallows future dates
                  onChange={(e) => {
                    updateFormData("step2", e.target.name, e.target.value);
                  }}
                  className={`form-input ${errors.endDate ? "input-error" : ""}`}
                />
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </label>
            </div>

            {/* Reason for Moving */}
            <div className="form-row">
              <label className="form-label">
                Reason for Moving
                <textarea
                  name="reasonForMoving"
                  placeholder="Enter reason for moving"
                  value={formData.step2.reasonForMoving}
                  onChange={(e) => updateFormData("step2", e.target.name, e.target.value)}
                  className={`form-textarea ${errors.reasonForMoving ? "input-error" : ""}`}
                ></textarea>
                {errors.reasonForMoving && <span className="error-message">{errors.reasonForMoving}</span>}
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
                  value={formData.step2.ownerManagerName}
                  onChange={(e) => updateFormData("step2", e.target.name, e.target.value)}
                  className={`form-input ${errors.ownerManagerName ? "input-error" : ""}`}
                />
                {errors.ownerManagerName && <span className="error-message">{errors.ownerManagerName}</span>}
              </label>
              <label className="form-label">
                Phone Number
                <input
                  type="tel"
                  name="ownerManagerPhone"
                  placeholder="Enter phone number"
                  value={formData.step2.ownerManagerPhone || ""}
                  maxLength={14} // Limit input length to fit the format (XXX) XXX-XXXX
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                    // Format as (XXX) XXX-XXXX
                    if (value.length > 3 && value.length <= 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else if (value.length > 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }

                    // Update formData with the formatted phone number
                    updateFormData("step2", e.target.name, value);

                    // Optional: Phone number validation (basic format check)
                    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
                    const isValidPhone = phonePattern.test(value);

                    // Set validation error if phone number doesn't match the pattern
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      ownerManagerPhone: !isValidPhone ? "Invalid phone number format" : "",
                    }));
                  }}
                  className={`form-input ${errors.ownerManagerPhone ? "input-error" : ""}`}
                />
                {errors.ownerManagerPhone && <span className="error-message">{errors.ownerManagerPhone}</span>}
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-content-employment-info">
            <h2 className="form-title-employment-info">Employment Information</h2>
            {formData.step3.employers.map((employer, index) => (
              <div key={index} className="employer-entry">
                <div className="form-row">
                  <label className="form-label">
                    Employer Name<span className="required">*</span>
                    <input
                      type="text"
                      placeholder="Enter employer name"
                      value={employer.employerName}
                      onChange={(e) => handleEmployerChange(index, "employerName", e.target.value)}
                      className="form-input"
                    />
                    {errors[`employerName-${index}`] && (
                      <span className="error">{errors[`employerName-${index}`]}</span>
                    )}
                  </label>
                  <label className="form-label">
                    Occupation<span className="required">*</span>
                    <input
                      type="text"
                      placeholder="Enter occupation"
                      value={employer.occupation}
                      onChange={(e) => handleEmployerChange(index, "occupation", e.target.value)}
                      className="form-input"
                    />
                    {errors[`occupation-${index}`] && <span className="error">{errors[`occupation-${index}`]}</span>}
                  </label>
                  <label className="form-label">
                    Employer Address<span className="required">*</span>
                    <input
                      type="text"
                      placeholder="Enter employer address"
                      value={employer.employerAddress}
                      onChange={(e) => handleEmployerChange(index, "employerAddress", e.target.value)}
                      className="form-input"
                    />
                    {errors[`employerAddress-${index}`] && (
                      <span className="error">{errors[`employerAddress-${index}`]}</span>
                    )}
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Employer Phone <span className="required">*</span>
                    <input
                      type="tel"
                      placeholder="Enter employer phone"
                      value={employer.employerPhone || ""}
                      maxLength={14} // Limit input length to fit the format (XXX) XXX-XXXX
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                        // Format as (XXX) XXX-XXXX
                        if (value.length > 3 && value.length <= 6) {
                          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                        } else if (value.length > 6) {
                          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                        }

                        // Update employer phone with formatted value
                        handleEmployerChange(index, "employerPhone", value);

                        // Optional: Employer phone number validation (basic format check)
                        const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
                        const isValidPhone = phonePattern.test(value);

                        // Optional: Validation error message logic
                        if (!isValidPhone) {
                          // Handle error message or class here if needed
                          console.log("Invalid phone number format");
                        }
                      }}
                      className="form-input"
                    />
                    {errors[`employerPhone-${index}`] && (
                      <span className="error">{errors[`employerPhone-${index}`]}</span>
                    )}
                  </label>
                  <label className="form-label">
                    Start Date of Employment<span className="required">*</span>
                    <input
                      type="date"
                      value={employer.startDate}
                      onChange={(e) => handleEmployerChange(index, "startDate", e.target.value)}
                      className="form-input"
                    />
                    {errors[`startDate-${index}`] && <span className="error">{errors[`startDate-${index}`]}</span>}
                  </label>
                  <label className="form-label">
                    Monthly Pay<span className="required">*</span>
                    <input
                      type="text" // Use "text" to apply custom restrictions
                      placeholder="Enter monthly pay"
                      value={employer.monthlyPay}
                      onChange={(e) => {
                        // Allow only digits
                        const numericValue = e.target.value.replace(/\D/g, "");
                        handleEmployerChange(index, "monthlyPay", numericValue);
                      }}
                      className="form-input"
                    />
                    {errors[`monthlyPay-${index}`] && <span className="error">{errors[`monthlyPay-${index}`]}</span>}
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-label">
                    Name of Supervisor <span className="required">*</span>
                    <input
                      type="text"
                      placeholder="Enter supervisor's name"
                      value={employer.supervisorName}
                      onChange={(e) => handleEmployerChange(index, "supervisorName", e.target.value)}
                      className="form-input"
                    />
                    {errors[`supervisorName-${index}`] && (
                      <span className="error">{errors[`supervisorName-${index}`]}</span>
                    )}
                  </label>
                </div>

                {formData.step3.employers.length > 1 && (
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
            {formData.step4.financialDetails.map((detail, index) => (
              <div key={index} className="financial-detail-row">
                {/* Financial Type */}
                <div className="form-group">
                  <label htmlFor={`type-${index}`} className="form-label">
                    Financial Type<span className="required">*</span>
                  </label>
                  <select
                    id={`type-${index}`}
                    name={`type-${index}`}
                    value={detail.type}
                    onChange={(e) => handleDetailChange(index, "type", e.target.value)}
                    className={`form-input ${errors[`type-${index}`] ? "input-error" : ""}`}
                  >
                    <option value="">Select Financial Type</option>
                    <option value="Checking Account">Checking Account</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Auto Loan">Auto Loan</option>
                    <option value="Additional Debt">Additional Debt</option>
                  </select>
                  {errors[`type-${index}`] && <span className="error-message">{errors[`type-${index}`]}</span>}
                </div>

                {/* Bank/Institution */}
                <div className="form-group">
                  <label htmlFor={`bank-${index}`} className="form-label">
                    Bank / Institution<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`bank-${index}`}
                    name={`bank-${index}`}
                    placeholder="Enter bank/institution"
                    value={detail.bank}
                    onChange={(e) => handleDetailChange(index, "bank", e.target.value)}
                    className={`form-input ${errors[`bank-${index}`] ? "input-error" : ""}`}
                  />
                  {errors[`bank-${index}`] && <span className="error-message">{errors[`bank-${index}`]}</span>}
                </div>

                {/* Balance */}
                <div className="form-group">
                  <label htmlFor={`balance-${index}`} className="form-label">
                    Balance<span className="required">*</span>
                  </label>
                  <input
                    type="text" // Use "text" to enable custom validation logic
                    id={`balance-${index}`}
                    name={`balance-${index}`}
                    placeholder="Enter balance"
                    value={detail.balance}
                    onChange={(e) => {
                      // Allow only numeric values
                      const numericValue = e.target.value.replace(/\D/g, "");
                      handleDetailChange(index, "balance", numericValue);
                    }}
                    className={`form-input ${errors[`balance-${index}`] ? "input-error" : ""}`}
                  />
                  {errors[`balance-${index}`] && <span className="error-message">{errors[`balance-${index}`]}</span>}
                </div>

                {/* Remove Button */}
                {formData.step4.financialDetails.length > 1 && (
                  <button type="button" onClick={() => removeFinancialDetail(index)} className="form-remove-btn">
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add Financial Detail Button */}
            <button type="button" onClick={addFinancialDetail} className="form-add-btn">
              Add Financial Detail
            </button>
          </div>
        );
      case 4:
        return (
          <div className="form-content-references">
            <h2 className="form-title-references">References & Background Information</h2>

            {/* References Section */}
            <div className="references-section">
              {formData.step5.references.map((reference, index) => (
                <div key={index} className="reference-entry">
                  <label className="form-label-reference-name">
                    Name <span className="required">*</span>
                    <input
                      type="text"
                      value={reference.name}
                      onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                      placeholder="Enter name"
                      className="form-input-reference-name"
                    />
                    {errors[`reference-name-${index}`] && (
                      <div className="error-message">{errors[`reference-name-${index}`]}</div>
                    )}
                  </label>

                  <label className="form-label-reference-phone">
                    Phone <span className="required">*</span>
                    <input
                      type="text"
                      value={reference.phone || ""}
                      maxLength={14} // Limit input length to fit the format (XXX) XXX-XXXX
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

                        // Format as (XXX) XXX-XXXX
                        if (value.length > 3 && value.length <= 6) {
                          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                        } else if (value.length > 6) {
                          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                        }

                        // Update reference phone with formatted value
                        handleReferenceChange(index, "phone", value);

                        // Optional: Reference phone number validation (basic format check)
                        const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
                        const isValidPhone = phonePattern.test(value);

                        // Optional: Handle validation error message if needed
                        if (!isValidPhone) {
                          console.log("Invalid phone number format");
                        }
                      }}
                      placeholder="Enter phone number"
                      className="form-input-reference-phone"
                    />
                    {errors[`reference-phone-${index}`] && (
                      <div className="error-message">{errors[`reference-phone-${index}`]}</div>
                    )}
                  </label>

                  <label className="form-label-reference-relationship">
                    Relationship <span className="required">*</span>
                    <input
                      type="text"
                      value={reference.relationship}
                      onChange={(e) => handleReferenceChange(index, "relationship", e.target.value)}
                      placeholder="Enter relationship"
                      className="form-input-reference-relationship"
                    />
                    {errors[`reference-relationship-${index}`] && (
                      <div className="error-message">{errors[`reference-relationship-${index}`]}</div>
                    )}
                  </label>

                  {/* Remove button only if there are multiple references */}
                  {formData.step5.references.length > 1 && (
                    <button type="button" onClick={() => removeReference(index)} className="btn-remove-reference">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {/* Add Reference Button */}
              <button type="button" onClick={addReference} className="btn-add-reference">
                Add Reference
              </button>
            </div>

            {/* Background Information Section */}
            <div className="background-info">
              {/* Late Rent Payment */}
              <label className="form-label-late-rent">
                Have you ever been late or delinquent on rent? <span className="required">*</span>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="lateRent"
                      value="Yes"
                      checked={formData.step5.backgroundInfo.lateRent === "Yes"}
                      onChange={(e) => handleBackgroundChange("lateRent", e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lateRent"
                      value="No"
                      checked={formData.step5.backgroundInfo.lateRent === "No"}
                      onChange={(e) => handleBackgroundChange("lateRent", e.target.value)}
                    />
                    No
                  </label>
                </div>
                {errors.lateRent && <div className="error-message">{errors.lateRent}</div>}
              </label>

              {/* Lawsuit History */}
              <label className="form-label-lawsuit">
                Have you ever been party to a lawsuit? <span className="required">*</span>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="lawsuit"
                      value="Yes"
                      checked={formData.step5.backgroundInfo.lawsuit === "Yes"}
                      onChange={(e) => handleBackgroundChange("lawsuit", e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lawsuit"
                      value="No"
                      checked={formData.step5.backgroundInfo.lawsuit === "No"}
                      onChange={(e) => handleBackgroundChange("lawsuit", e.target.value)}
                    />
                    No
                  </label>
                </div>
                {errors.lawsuit && <div className="error-message">{errors.lawsuit}</div>}
              </label>

              {/* Smoking Status */}
              <label className="form-label-smoke">
                Do you smoke? <span className="required">*</span>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="smoke"
                      value="Yes"
                      checked={formData.step5.backgroundInfo.smoke === "Yes"}
                      onChange={(e) => handleBackgroundChange("smoke", e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="smoke"
                      value="No"
                      checked={formData.step5.backgroundInfo.smoke === "No"}
                      onChange={(e) => handleBackgroundChange("smoke", e.target.value)}
                    />
                    No
                  </label>
                </div>
                {errors.smoke && <div className="error-message">{errors.smoke}</div>}
              </label>

              {/* Pet Ownership */}
              <label className="form-label-pets">
                Do you have any pets? <span className="required">*</span>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="pets"
                      value="Yes"
                      checked={formData.step5.backgroundInfo.pets === "Yes"}
                      onChange={(e) => handleBackgroundChange("pets", e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="pets"
                      value="No"
                      checked={formData.step5.backgroundInfo.pets === "No"}
                      onChange={(e) => handleBackgroundChange("pets", e.target.value)}
                    />
                    No
                  </label>
                </div>
                {errors.pets && <div className="error-message">{errors.pets}</div>}
              </label>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-content-final-comments">
            <h2 className="form-title-final-comments">Additional Info & Payment</h2>

            {/* New Question 1 */}
            <label htmlFor="moveReason" className="form-label-comments">
              Why are you moving from your current address?
            </label>
            <textarea
              id="moveReason"
              name="moveReason"
              placeholder="Enter the reason for moving"
              value={formData.step6.moveReason}
              onChange={(e) => handleMoveReasonChange(e.target.value)}
              className="form-textarea-comments"
            ></textarea>

            {/* New Question 2 */}
            <label htmlFor="creditCheckComments" className="form-label-comments">
              Is there anything negative in your credit or background check you want to comment on?
            </label>
            <textarea
              id="creditCheckComments"
              name="creditCheckComments"
              placeholder="Enter comments about your credit or background check"
              value={formData.step6.creditCheckComments}
              onChange={(e) => handleCreditCheckCommentsChange(e.target.value)}
              className="form-textarea-comments"
            ></textarea>

            {/* Additional Questions Section */}
            <label htmlFor="comments" className="form-label-comments">
              Additional Questions
            </label>
            <textarea
              id="comments"
              name="comments"
              placeholder="Enter any additional information"
              value={formData.step6.comments}
              onChange={(e) => handleCommentsChange(e.target.value)}
              className="form-textarea-comments"
            ></textarea>

            <MyPaymentForm />
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
          <div key={index} className={`step-multi-step ${index <= currentStep ? "active-step" : ""}`}>
            <span className={`step-icon-${index}`}>{step.icon}</span> {/* Render the icon as a React component */}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} id="tenantForm">
        <div className="form-step-content">{renderFormContent()}</div>

        <div className="form-navigation-multi-step">
          {currentStep > 0 && (
            <button type="button" onClick={() => updateStep(currentStep - 1)} className="btn-prev-multi-step">
              Previous
            </button>
          )}

          {currentStep < steps.length - 1 && (
            <button
              type="button"
              className="btn-next-multi-step"
              onClick={() => {
                const validations = [validate, validateCase1, validateCase2, validateCase3, validateCase4];
                if (validations[currentStep]()) {
                  updateStep(currentStep + 1);
                } else {
                  setPopupMessage("Please fill out all required fields correctly.");
                  setShowPopup(true); // Show error message in the popup
                }
              }}
            >
              Next
            </button>
          )}

          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              onClick={(e) => {
                if (validate()) {
                  handleSubmit(e);
                } else {
                  e.preventDefault();
                  setPopupMessage("Please fill out all required fields correctly.");
                  setShowPopup(true); // Show error message in the popup
                }
              }}
              className="btn-submit-multi-step"
            >
              Submit
            </button>
          )}
        </div>
      </form>

      {/* Popup Message */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;

{
  /* <div className="form-row">
              <div id="card-container" />
              <div onClick={handlePayment}>Pay</div>
            </div> */
}
{
  /* improve the page styling for payment  */
}
