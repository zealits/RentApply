import React, { useState } from "react";
import { CreditCard, GooglePay, CashAppPay, ApplePay, PaymentForm } from "react-square-web-payments-sdk";

const SquarePaymentForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePaymentComplete = async (token, buyer) => {
    try {
      setLoading(true);
      setError("");

      console.log("Payment Token:", token);
      console.log("Buyer Details:", buyer);

      // Here you would typically make an API call to your backend
      // to process the payment using the token
    } catch (err) {
      setError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Separate payment requests for different payment methods
  const createCashAppPaymentRequest = () => ({
    countryCode: "US",
    currencyCode: "USD",
    total: {
      amount: "100", // $1.00 USD
      label: "Total",
    },
  });

  const createGooglePaymentRequest = () => ({
    countryCode: "GB",
    currencyCode: "GBP",
    total: {
      amount: "100", // £1.00 GBP
      label: "Total",
    },
  });

  const createApplePaymentRequest = () => ({
    countryCode: "US",
    currencyCode: "USD",
    total: {
      amount: "100", // $1.00 USD
      label: "Total",
    },
    lineItems: [
      {
        label: "Subtotal",
        amount: "100",
      },
    ],
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="text-gray-600">Choose your payment method</p>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

      {/* Cash App Pay Form (USD) */}
      <PaymentForm
        applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
        locationId="L0TCSMSRY7SEA"
        cardTokenizeResponseReceived={handlePaymentComplete}
        createPaymentRequest={createCashAppPaymentRequest}
        createVerificationDetails={() => ({
          amount: "100",
          currencyCode: "USD",
          intent: "CHARGE",
          billingContact: {
            familyName: "Doe",
            givenName: "John",
            addressLines: ["123 Main Street"],
            city: "New York",
            countryCode: "US",
          },
        })}
        callbacks={{
          onCashAppPayError: (error) => {
            console.error("Cash App Pay error:", error);
            setError("Cash App Pay payment failed. Please try another method.");
          },
        }}
      >
        <div className="mb-4">
          <CashAppPay redirectURL={window.location.href} referenceId={`order-${Date.now()}`} />
        </div>
      </PaymentForm>

      {/* Apple Pay Form (USD) */}
      <PaymentForm
        applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
        locationId="L0TCSMSRY7SEA"
        cardTokenizeResponseReceived={handlePaymentComplete}
        createPaymentRequest={createApplePaymentRequest}
        createVerificationDetails={() => ({
          amount: "100",
          currencyCode: "USD",
          intent: "CHARGE",
          billingContact: {
            familyName: "Doe",
            givenName: "John",
            addressLines: ["123 Main Street"],
            city: "New York",
            countryCode: "US",
          },
        })}
      >
        <div className="mb-4">
          <ApplePay />
        </div>
      </PaymentForm>

      {/* Google Pay and Credit Card Form (GBP) */}
      <PaymentForm
        applicationId="sandbox-sq0idb-KKtnWs0ZX9C0vGFpeL6dEQ"
        locationId="L0TCSMSRY7SEA"
        cardTokenizeResponseReceived={handlePaymentComplete}
        createPaymentRequest={createGooglePaymentRequest}
        createVerificationDetails={() => ({
          amount: "100",
          currencyCode: "GBP",
          intent: "CHARGE",
          billingContact: {
            familyName: "Doe",
            givenName: "John",
            addressLines: ["123 Main Street"],
            city: "London",
            countryCode: "GB",
          },
        })}
      >
        <div className="space-y-4">
          <GooglePay buttonColor="black" buttonType="long" buttonSizeMode="fill" />

          <div className="border rounded-lg p-4">
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
          </div>
        </div>
      </PaymentForm>
    </div>
  );
};

export default SquarePaymentForm;
