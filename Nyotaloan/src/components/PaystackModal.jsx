import { useEffect, useState } from 'react';
import '../styles/PaymentModal.css';

export default function PaystackModal({ package: pkg, applicantData, onClose, onConfirm }) {
  const [email, setEmail] = useState(applicantData?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_KEY || 'pk_test_demo_key_change_this';

  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handlePaystackPayment = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const totalAmount = (pkg.amount + pkg.fee) * 100; // Paystack uses cents

    // Initialize Paystack payment
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: totalAmount,
      currency: 'KES',
      ref: `NYOMA-${Date.now()}`,
      onClose: function () {
        setLoading(false);
      },
      callback: function (response) {
        setLoading(false);
        // Verify payment on backend (not implemented in this demo)
        onConfirm({
          paymentMethod: 'paystack',
          packageId: pkg.id,
          amount: pkg.amount,
          fee: pkg.fee,
          email: email,
          reference: response.reference,
          status: 'completed',
        });
      },
    });
    handler.openIframe();
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal slide-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="payment-modal-content">
          <div className="payment-info">
            <div className="info-item">
              <span className="info-label">Loan Amount:</span>
              <span className="info-value">KES {pkg.amount.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Processing Fee:</span>
              <span className="info-value">KES {pkg.fee}</span>
            </div>
            <div className="info-item total">
              <span className="info-label">Total Amount:</span>
              <span className="info-value">KES {(pkg.amount + pkg.fee).toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handlePaystackPayment(); }}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="your@email.com"
                className={error ? 'error' : ''}
                disabled={loading}
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <div className="paystack-terms">
              <input type="checkbox" id="paystack-terms" required />
              <label htmlFor="paystack-terms">
                I authorize Paystack to charge me KES {(pkg.amount + pkg.fee).toLocaleString()} for this loan application
              </label>
            </div>

            <div className="payment-methods">
              <p className="payment-methods-title">Payment Methods Supported:</p>
              <div className="methods-list">
                <span>💳 Debit/Credit Card</span>
                <span>📱 Mobile Money</span>
                <span>🏦 Bank Transfer</span>
                <span>🔐 USSD</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-paystack"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay with Paystack'}
              </button>
            </div>
          </form>

          <div className="paystack-footer">
            <p>🔒 Secure payment powered by Paystack</p>
            <p>Your payment information is encrypted and safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
