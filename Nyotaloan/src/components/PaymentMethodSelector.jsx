import { useState } from 'react';
import '../styles/PaymentMethodSelector.css';

export default function PaymentMethodSelector({ onSelect, onClose }) {
  return (
    <div className="method-selector-overlay" onClick={onClose}>
      <div className="method-selector slide-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="method-selector-header">
          <h2>Choose Payment Method</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="method-selector-content">
          <p className="method-subtitle">Select your preferred payment method</p>

          <div className="payment-methods-grid">
            {/* M-Pesa */}
            <button
              className="payment-method-card mpesa-card"
              onClick={() => onSelect('mpesa')}
            >
              <div className="method-icon">📱</div>
              <h3>M-Pesa</h3>
              <p>Instant payment via Safaricom</p>
              <span className="method-badge">Most Popular</span>
            </button>

            {/* Paystack */}
            <button
              className="payment-method-card paystack-card"
              onClick={() => onSelect('paystack')}
            >
              <div className="method-icon">💳</div>
              <h3>Paystack</h3>
              <p>Card, Mobile Money & Bank Transfer</p>
              <span className="method-badge">Secure</span>
            </button>
          </div>

          <div className="method-features">
            <div className="feature">
              <span className="feature-icon">✓</span>
              <div>
                <strong>M-Pesa</strong>
                <p>Fast, secure Safaricom payment</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">✓</span>
              <div>
                <strong>Paystack</strong>
                <p>Multiple payment options available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
