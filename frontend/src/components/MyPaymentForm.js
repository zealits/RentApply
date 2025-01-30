import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import "./MyPaymentForm.css";
import { createPayment , clearPaymentError} from "../services/Actions/paymentActions";

const NotificationModal = ({ message, type, onClose }) => (
  <div className={`notification-modal ${type}`}>
    <div className="notification-content">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const PaymentButton = ({ isDisabled, timeRemaining, children }) => {
  return (
    <div className="payment-button-wrapper">
      {children}
      {isDisabled && (
        <div className="disable-overlay">
          <p>Please wait {timeRemaining} seconds...</p>
        </div>
      )}
    </div>
  );
};


// Helper function to format error message
const formatErrorMessage = (error) => {
  if (!error) return "An unknown error occurred";
  
  // Handle array of errors
  if (Array.isArray(error)) {
    const firstError = error[0];
    if (firstError?.category === "PAYMENT_METHOD_ERROR") {
      return getPaymentMethodErrorMessage(firstError.code, firstError.detail);
    }
    return firstError?.detail || "Payment processing failed. Please try again.";
  }

  // Handle single error object
  if (typeof error === "object" && error.category === "PAYMENT_METHOD_ERROR") {
    return getPaymentMethodErrorMessage(error.code, error.detail);
  }

  // Fallback for string errors or other formats
  return error.toString();
};

const getPaymentMethodErrorMessage = (code, detail) => {
  switch (code) {
    case "PAN_FAILURE":
      return "The card number entered is invalid. Please check and try again.";
    case "ADDRESS_VERIFICATION_FAILURE":
      return "The postal code entered does not match the card's billing address.";
    case "BAD_EXPIRATION":
      return "The expiration date provided is incorrect or formatted improperly.";
    case "CARDHOLDER_INSUFFICIENT_PERMISSIONS":
      return "The card cannot be used for this type of transaction.";
    case "CARD_EXPIRED":
      return "The card has expired. Please use a different card.";
    case "CARD_NOT_SUPPORTED":
      return "This card is not supported for the transaction.";
    case "CVV_FAILURE":
      return "The CVV code entered is incorrect. Please check and try again.";
    case "EXPIRATION_FAILURE":
      return "The expiration date is invalid or has expired.";
    case "GENERIC_DECLINE":
      return "The transaction was declined by the card issuer.";
    case "INSUFFICIENT_FUNDS":
      return "There are insufficient funds on the card.";
    case "INVALID_ACCOUNT":
      return "The provided card account could not be found.";
    case "INVALID_CARD":
      return "The card details provided are incorrect.";
    case "INVALID_CARD_DATA":
      return "The card data is invalid. Please check and try again.";
    case "INVALID_EXPIRATION":
      return "The expiration date is invalid or formatted incorrectly.";
    case "INVALID_PIN":
      return "The PIN entered is incorrect.";
    default:
      return detail || "Payment processing failed. Please try again.";
  }
};



const SquarePaymentForm = ({ onClose, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const dispatch = useDispatch();
  const { paymentData ,error } = useSelector((state) => state.payment);
  console.log(error);
  // after submission if there is error then show that error as well 
  const paymentStatus = paymentData?.payment?.status;

  const paymentReceiptUrl = paymentData?.payment?.receiptUrl;
  const TransactionId = paymentData?.payment?.id;

   // Add error monitoring effect
   // Modified error monitoring effect
   useEffect(() => {
    if (error) {
      const formattedError = formatErrorMessage(error);
      onPaymentError(formattedError);
      setIsDisabled(false);
      setTimeRemaining(60);
    }
  }, [error, onPaymentError]);


  useEffect(() => {
    let timer;
    if (isDisabled && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            setIsDisabled(false);
            return 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isDisabled, timeRemaining]);

  // Automatically close modal if payment is completed
  // useEffect(() => {
  //   if (paymentStatus === "COMPLETED") {
  //     onPaymentSuccess(`Payment successful! Transaction ID: ${TransactionId}`);
  //     onClose();
  //   }
  // }, [paymentStatus, onPaymentSuccess, onClose, TransactionId]);

  const handlePaymentComplete = async ({ token }) => {
    if (isDisabled) {
      return;
    }

    try {
      setLoading(true);
      setIsDisabled(true);
      setTimeRemaining(60);
      // console.log("aniket");

      if (token) {
        dispatch(createPayment(token, 6000)); // Dispatch action with token and amount

        // Handle Redux state to check for completion (handled via useEffect)
      } else {
        setIsDisabled(false); 
        onPaymentError("Tokenization failed!");
      }
    } catch (err) {
      onPaymentError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


   // Add these styles to your CSS file
   const styles = `
   .payment-button-wrapper {
     position: relative;
   }
   
   .disable-overlay {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background: rgba(0, 0, 0, 0.5);
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 4px;
     z-index: 10;
   }
   
   .disable-overlay p {
     color: white;
     margin: 0;
     padding: 8px;
     text-align: center;
   }
 `;

  return (
    paymentStatus !== "COMPLETED" && (
      <div className="payment-modal">
      <style>{styles}</style>
      <div className="payment-modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">Pay $60</h2>
        <p className="modal-description">
          Please complete the payment to proceed. This amount will be used for your booking.
        </p>

        <PaymentButton isDisabled={isDisabled} timeRemaining={timeRemaining}>
          <PaymentForm
            // applicationId="sandbox-sq0idb-Bxh90l3ICb_CDRCk8afEmg"
            // locationId="L4QXZG5MHKKQZ"

             applicationId="sq0idp-GtV2bseJGu7vISGpUwTWtg"
            locationId="LK27SNYH75P0Q"
            cardTokenizeResponseReceived={handlePaymentComplete}
          >
            <CreditCard
              buttonProps={{
                isLoading: loading,
                css: {
                  backgroundColor: "#000",
                  fontSize: "16px",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#080808",
                  },
                  pointerEvents: isDisabled ? "none" : "auto",
                },
              }}
            />
          </PaymentForm>
        </PaymentButton>
      </div>
    </div>
    )
  );
};

const FinalDetailsForm = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const dispatch = useDispatch();
  const { paymentData } = useSelector((state) => state.payment);
  const paymentStatus = paymentData?.payment?.status;
  const paymentReceiptUrl = paymentData?.payment?.receiptUrl;
  const paymentId = paymentData?.payment?.id;
  console.log(paymentId);


  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    // setTimeout(() => setNotification(null), 5000);
  };

  const handleNotificationClose = () => {
    setNotification(null);
    // Clear the error from Redux state
    dispatch(clearPaymentError());
  };

  return (
    <div>
      {/* Hide payment button if payment is completed */}
      {paymentStatus !== "COMPLETED" ? (
        <button type="button" className="payment-button" onClick={openPaymentModal}>
          Proceed to Payment
        </button>
      ) : (
        <div>
          <p className="payment-success-message">Payment completed successfully!</p>
          <p className="payment-transaction-id">Submitting your form... Please wait! Do not refresh the page.</p>
          {/* <p className="payment-transaction-id">Transaction Id : {paymentId}</p> */}
          {/*   <a className="payment-receipt-link" href={paymentReceiptUrl} target="_blank" rel="noopener noreferrer">
            View Payment Receipt
          </a> */}
        </div>
      )}

      {isPaymentModalOpen && (
        <SquarePaymentForm
          onClose={closePaymentModal}
          onPaymentSuccess={(message) => showNotification(message, "success")}
          onPaymentError={(message) => showNotification(message, "error")}
        />
      )}

      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

export default FinalDetailsForm;

// <PaymentForm
// applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
// locationId="L0TCSMSRY7SEA"
// cardTokenizeResponseReceived={handlePaymentComplete}
// createPaymentRequest={createCashAppPaymentRequest}
// createVerificationDetails={() => ({
//   amount: "100",
//   currencyCode: "USD",
//   intent: "CHARGE",
//   billingContact: {
//     familyName: "Doe",
//     givenName: "John",
//     addressLines: ["123 Main Street"],
//     city: "New York",
//     countryCode: "US",
//   },
// })}
// callbacks={{
//   onCashAppPayError: (error) => {
//     console.error("Cash App Pay error:", error);
//     setError("Cash App Pay payment failed. try another method.");
//   },
// }}
// >
// <div className="mb-4">
//   <CashAppPay redirectURL={window.location.href} referenceId={`order-${Date.now()}`} />
// </div>
// </PaymentForm>

// <PaymentForm
// applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
// locationId="L0TCSMSRY7SEA"
// cardTokenizeResponseReceived={handlePaymentComplete}
// createPaymentRequest={createApplePaymentRequest}
// createVerificationDetails={() => ({
//   amount: "100",
//   currencyCode: "USD",
//   intent: "CHARGE",
//   billingContact: {
//     familyName: "Doe",
//     givenName: "John",
//     addressLines: ["123 Main Street"],
//     city: "New York",
//     countryCode: "US",
//   },
// })}
// >
// <div className="mb-4">
//   <ApplePay />
// </div>
// </PaymentForm>

// <PaymentForm
// applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
// locationId="L0TCSMSRY7SEA"
// cardTokenizeResponseReceived={handlePaymentComplete}
// createPaymentRequest={createGooglePaymentRequest}
// // Add these additional props for better error handling
// overrideSquareProvider={{
//   scriptSource:
//     ENVIRONMENT === "production"
//       ? "https://web.squarecdn.com/v1/square.js"
//       : "https://sandbox.web.squarecdn.com/v1/square.js",
//   async onLoad() {
//     console.log("Square script loaded successfully");
//   },
//   async onError(err) {
//     console.error("Square script failed to load:", err);
//     setError("Failed to load payment system. Please try again later.");
//   },
// }}
// >
// <div className="mb-4">
//   <GooglePay buttonColor="black" buttonType="long" buttonSizeMode="fill" />
// </div>
// </PaymentForm>

// Separate payment requests for different payment methods
// const createCashAppPaymentRequest = () => ({
//   countryCode: "US",
//   currencyCode: "USD",
//   total: {
//     amount: "100", // $1.00 USD
//     label: "Total",
//   },
// });

// const createGooglePaymentRequest = () => {
//   return {
//     countryCode: "US",
//     currencyCode: "USD",
//     total: {
//       amount: "1.00",
//       label: "Total"
//     }

//   };
// };

// const createApplePaymentRequest = () => ({
//   countryCode: "US",
//   currencyCode: "USD",
//   total: {
//     amount: "100", // $1.00 USD
//     label: "Total",
//   },
//   lineItems: [
//     {
//       label: "Subtotal",
//       amount: "100",
//     },
//   ],
// });
