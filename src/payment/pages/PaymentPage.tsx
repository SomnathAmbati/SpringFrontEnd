import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PaymentPage.css";
import api from "../../common/utils/api";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const totalAmount: number = location.state?.totalAmount || 0;
  const bookingId: number = location.state?.bookingId;

  const [paymentMode, setPaymentMode] = useState<"credit" | "debit" | "">("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [nameError, setNameError] = useState("");

  const [success, setSuccess] = useState("");

  /* ---------- FORMATTERS ---------- */
  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  /* ---------- PAYABLE AMOUNT ---------- */
  const payableAmount =
    paymentMode === "credit"
      ? totalAmount * 0.9
      : paymentMode === "debit"
      ? totalAmount * 0.95
      : totalAmount;

  /* ---------- VALIDATIONS ---------- */
  const handleCardChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits);
    setCardError(digits.length < 16 ? "Card number must be 16 digits" : "");
  };

  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    const formatted = formatExpiry(value);
    setExpiry(formatted);

    if (digits.length < 4) {
      setExpiryError("Enter expiry in MM/YY format");
      return;
    }

    const month = parseInt(digits.slice(0, 2));
    const year = parseInt("20" + digits.slice(2));

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (month < 1 || month > 12) {
      setExpiryError("Invalid month");
    } else if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      setExpiryError("Card has expired");
    } else {
      setExpiryError("");
    }
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 3);
    setCvv(digits);
    setCvvError(digits.length < 3 ? "CVV must be 3 digits" : "");
  };

  const handleNameChange = (value: string) => {
    setCardHolder(value);
    setNameError(!value.trim() ? "Card holder name is required" : "");
  };

  const handlePay = async () => {
    if (!paymentMode || cardError || expiryError || cvvError || nameError) {
      return;
    }
  
    try {
      const res = await api.post("/payments", {
        bookingId,
        mode: paymentMode.toUpperCase() // CREDIT / DEBIT
      });
  
      setSuccess("🎉 Payment Successful!");
      setTimeout(() => {
        window.location.href = "/my-bookings";
      }, 2000);
  
    } catch (err: any) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="payment-bg">
      <div className="payment-card">

        {/* Header */}
        <div className="payment-header mb-3">
          <h3 className="fw-bold mb-0">🔐 Secure Payment</h3>
          <div className="amount-inline">
            ₹{payableAmount.toFixed(2)}
          </div>
        </div>

        {/* Payment Mode */}
        <div className="mb-3">
          <label className="fw-semibold">Choose Payment Method</label>
          <div className="d-flex gap-3 mt-2">
            <div
              className={`pay-option ${paymentMode === "credit" ? "active" : ""}`}
              onClick={() => setPaymentMode("credit")}
            >
              💳 Credit Card <small>10% OFF</small>
            </div>
            <div
              className={`pay-option ${paymentMode === "debit" ? "active" : ""}`}
              onClick={() => setPaymentMode("debit")}
            >
              💳 Debit Card <small>5% OFF</small>
            </div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-3">
          <label>Card Number</label>
          <input
            className={`form-control ${cardError ? "is-invalid" : ""}`}
            placeholder="XXXX XXXX XXXX XXXX"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => handleCardChange(e.target.value)}
            disabled={!paymentMode}
          />
          <div className="invalid-feedback">{cardError}</div>
        </div>

        {/* Expiry & CVV */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Expiry (MM/YY)</label>
            <input
              className={`form-control ${expiryError ? "is-invalid" : ""}`}
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              disabled={!paymentMode}
            />
            <div className="invalid-feedback">{expiryError}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label>CVV</label>
            <input
              type="password"
              className={`form-control ${cvvError ? "is-invalid" : ""}`}
              value={cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              disabled={!paymentMode}
            />
            <div className="invalid-feedback">{cvvError}</div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label>Card Holder Name</label>
          <input
            className={`form-control ${nameError ? "is-invalid" : ""}`}
            value={cardHolder}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={!paymentMode}
          />
          <div className="invalid-feedback">{nameError}</div>
        </div>

        {success && <div className="success-box">{success}</div>}

        <button
          className="btn pay-btn w-100"
          onClick={handlePay}
          disabled={!paymentMode}
        >
          Pay Securely
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;




