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

const SquarePaymentForm = ({ onClose, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { paymentData } = useSelector((state) => state.payment);
  const paymentStatus = paymentData?.payment?.status;

  // Automatically close modal if payment is completed
  useEffect(() => {
    if (paymentStatus === "COMPLETED") {
      onPaymentSuccess("Payment successful!");
      onClose();
    }
  }, [paymentStatus, onPaymentSuccess, onClose]);

  const handlePaymentComplete = async ({ token }) => {
    try {
      setLoading(true);

      if (token) {
        dispatch(createPayment(token, 60)); // Dispatch action with token and amount

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

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">Pay $60</h2>
        <p className="modal-description">
          Please complete the payment to proceed. This amount will be used for your booking.
        </p>
        <PaymentForm
          // applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
          applicationId="sandbox-sq0idb-Bxh90l3ICb_CDRCk8afEmg"
          // locationId="L0TCSMSRY7SEA"
          locationId="L4QXZG5MHKKQZ"
          cardTokenizeResponseReceived={handlePaymentComplete}
        >
          <CreditCard
            buttonProps={{
              isLoading: loading,
              css: {
                backgroundColor: "#4F46E5",
                fontSize: "16px",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#4338CA",
                },
              },
            }}
          />
        </PaymentForm>
      </div>
    </div>
  );
};

const FinalDetailsForm = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const { paymentData } = useSelector((state) => state.payment);
  const paymentStatus = paymentData?.payment?.status;

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      {/* Hide payment button if payment is completed */}
      {paymentStatus !== "COMPLETED" ? (
        <button type="button" className="payment-button" onClick={openPaymentModal}>
          Proceed to Payment
        </button>
      ) : (
        <p className="payment-success-message">Payment completed successfully!</p>
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
