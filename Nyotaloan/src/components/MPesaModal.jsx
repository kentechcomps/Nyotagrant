import { useState } from 'react';
import '../styles/MPesaModal.css';

export default function MPesaModal({ package: pkg, onClose, onConfirm }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    // Kenyan phone number formats: 0712345678, +254712345678, 254712345678, 712345678
    const cleanNumber = number.replace(/\s+/g, '');
    const kenyaPhoneRegex = /^(?:\+254|254|0)?([71]\d{8})$/;
    return kenyaPhoneRegex.test(cleanNumber);
  };

  const formatPhoneNumber = (number) => {
    const cleanNumber = number.replace(/\s+/g, '').replace(/^0/, '254').replace(/^\+/, '');
    return '254' + cleanNumber.slice(-9);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setLoading(true);
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    // Get applicant data from sessionStorage
    const applicantData = JSON.parse(sessionStorage.getItem('applicantData') || '{}');
    const email = applicantData.email || '';
    
    // Generate unique reference
    const reference = `MPESA_${Date.now()}_${pkg.id}`;

    // Prepare payload for backend (matches what backend expects)
    const payload = {
      phone: formattedNumber,           // 254712345678
      amount: pkg.fee,                  // Service/Processing fee only
      reference: reference,             // Unique transaction reference
      email: email                       // Applicant email
    };

    console.log('📱 Sending M-Pesa payment to backend:', payload);

    // Send to backend
    fetch('http://127.0.0.1:5000/paystack/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(response => {
        setLoading(false);
        console.log('✅ Backend response:', response);
        
        if (response.message) {
          // Success - store payment data and confirm
          onConfirm({
            reference: reference,
            phone: formattedNumber,
            amount: pkg.amount,
            fee: pkg.fee,
            email: email,
            total: pkg.amount + pkg.fee,
            status: 'pending'
          });
        } else {
          setError(response.message || 'Failed to process payment');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('❌ M-Pesa Error:', err);
        setError('Network error. Please try again.');
      });
  };

  return (
    <div className="mpesa-modal-overlay" onClick={onClose}>
      <div className="mpesa-modal slide-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="mpesa-modal-header">
          <h2>Enter M-Pesa Number</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="mpesa-modal-content">
          <div className="mpesa-info">
            <div className="info-item">
              <span className="info-label">Loan Amount:</span>
              <span className="info-value">KES {pkg.amount.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Processing Fee:</span>
              <span className="info-value">KES {pkg.fee}</span>
            </div>
            <div className="info-item total">
              <span className="info-label">Total Cost:</span>
              <span className="info-value">KES {(pkg.amount + pkg.fee).toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phoneNumber">Safaricom M-Pesa Number</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">🇰🇪 +254</span>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="712 345 678"
                  className={error ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {error && <span className="error-message">{error}</span>}
              <p className="phone-helper">Enter your 10-digit number or with 0 prefix</p>
            </div>

            <div className="mpesa-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to proceed with the M-Pesa payment for KES {(pkg.amount + pkg.fee).toLocaleString()}
              </label>
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
                className="btn btn-primary btn-mpesa"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay with M-Pesa'}
              </button>
            </div>
          </form>

          <div className="mpesa-footer">
            <p>🔒 Your payment information is secure and encrypted</p>
            <p>You will receive an M-Pesa STK prompt on your phone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
