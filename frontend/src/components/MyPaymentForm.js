import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import "./MyPaymentForm.css";
import { createPayment } from "../services/Actions/paymentActions";

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


const SquarePaymentForm = ({ onClose, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const dispatch = useDispatch();
  const { paymentData } = useSelector((state) => state.payment);
  const paymentStatus = paymentData?.payment?.status;

  const paymentReceiptUrl = paymentData?.payment?.receiptUrl;
  const TransactionId = paymentData?.payment?.id;

  useEffect(() => {
    let timer;
    if (isButtonDisabled && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsButtonDisabled(false);
      setTimeRemaining(60);
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled, timeRemaining]);

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
          onClose={() => setNotification(null)}
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
