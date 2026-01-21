import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MPesaModal from '../components/MPesaModal';
import PaystackModal from '../components/PaystackModal';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import '../styles/LoanPackages.css';

const packages = [
  {
    id: 1,
    amount: 5000,
    fee: 110,
    repaymentPeriod: '7-30 days',
    interest: '2.5%',
    description: 'Quick access for small needs',
    note: 'Fee payable before disbursement'
  },
  {
    id: 2,
    amount: 10000,
    fee: 150,
    repaymentPeriod: '14-30 days',
    interest: '2.5%',
    description: 'Our most popular package',
    featured: true,
    note: 'One-time processing fee'
  },
  {
    id: 3,
    amount: 22000,
    fee: 210,
    repaymentPeriod: '30-60 days',
    interest: '2%',
    description: 'Larger amounts for bigger dreams',
    note: 'Instant processing via M-Pesa'
  }
];

export default function LoanPackages() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [showMPesaModal, setShowMPesaModal] = useState(false);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [applicantData, setApplicantData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('applicantData');
    if (data) {
      setApplicantData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowMethodSelector(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setShowMethodSelector(false);
    if (method === 'mpesa') {
      setShowMPesaModal(true);
    } else if (method === 'paystack') {
      setShowPaystackModal(true);
    }
  };

  const handleMPesaConfirm = (paymentData) => {
    setShowMPesaModal(false);
    // Store payment data and show success message
    alert(
      `✅ Payment initiated!\n\nLoan: KES ${paymentData.amount.toLocaleString()}\nFee: KES ${paymentData.fee}\nM-Pesa: ${paymentData.phoneNumber}\n\nYou will receive an M-Pesa prompt shortly.`
    );
    // Ready for backend integration
    sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
  };

  const handlePaystackConfirm = (paymentData) => {
    setShowPaystackModal(false);
    // Store payment data and show success message
    alert(
      `✅ Payment processing!\n\nLoan: KES ${paymentData.amount.toLocaleString()}\nFee: KES ${paymentData.fee}\nEmail: ${paymentData.email}\nRef: ${paymentData.reference}\n\nPayment confirmed via Paystack.`
    );
    // Ready for backend integration
    sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
  };

  const handleCloseModals = () => {
    setShowMethodSelector(false);
    setShowMPesaModal(false);
    setShowPaystackModal(false);
    setSelectedPackage(null);
  };

  const getTotalCost = (pkg) => {
    return pkg.amount + pkg.fee;
  };

  return (
    <div className="loan-packages">
      {/* Payment Method Selector */}
      {showMethodSelector && selectedPackage && (
        <PaymentMethodSelector
          onSelect={handlePaymentMethodSelect}
          onClose={handleCloseModals}
        />
      )}

      {/* M-Pesa Modal */}
      {showMPesaModal && selectedPackage && (
        <MPesaModal
          package={selectedPackage}
          onClose={handleCloseModals}
          onConfirm={handleMPesaConfirm}
        />
      )}

      {/* Paystack Modal */}
      {showPaystackModal && selectedPackage && (
        <PaystackModal
          package={selectedPackage}
          applicantData={applicantData}
          onClose={handleCloseModals}
          onConfirm={handlePaystackConfirm}
        />
      )}

      {/* Header */}
      <section className="packages-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back
          </button>
          <h1 className="slide-in-up">Choose Your Loan Package</h1>
          <p className="packages-subtitle slide-in-up">
            {applicantData && `Welcome, ${applicantData.fullName.split(' ')[0]}!`}
          </p>
          <p className="packages-description slide-in-up">
            Select the loan amount that works best for you. All packages include transparent fees and flexible repayment options.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="packages-section">
        <div className="container">
          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`package-card slide-in-up ${pkg.featured ? 'featured' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {pkg.featured && <div className="featured-badge">Most Popular</div>}
                
                <div className="package-header">
                  <h3>KES {pkg.amount.toLocaleString()}</h3>
                  <p className="package-description">{pkg.description}</p>
                </div>

                <div className="package-details">
                  <div className="detail-row">
                    <span className="detail-label">Processing Fee:</span>
                    <span className="detail-value">KES {pkg.fee}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Interest Rate:</span>
                    <span className="detail-value">{pkg.interest}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Repayment Period:</span>
                    <span className="detail-value">{pkg.repaymentPeriod}</span>
                  </div>
                  <div className="detail-row total">
                    <span className="detail-label">Total Cost:</span>
                    <span className="detail-value">KES {getTotalCost(pkg).toLocaleString()}</span>
                  </div>
                  <div className="package-note">
                    <span className="note-icon">ℹ</span> {pkg.note}
                  </div>
                </div>

                <div className="package-action">
                  <button 
                    className={`btn ${pkg.featured ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSelectPackage(pkg)}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Messaging Section */}
      <section className="payment-messaging-section">
        <div className="container">
          <div className="messaging-cards">
            <div className="messaging-card slide-in-up">
              <div className="msg-icon">📱</div>
              <h4>M-Pesa Payment</h4>
              <p>You will be prompted to pay the processing fee via M-Pesa when you proceed.</p>
            </div>
            <div className="messaging-card slide-in-up">
              <div className="msg-icon">✓</div>
              <h4>Ensure M-Pesa is Active</h4>
              <p>Make sure your M-Pesa line is active and has sufficient balance for the fee.</p>
            </div>
            <div className="messaging-card slide-in-up">
              <div className="msg-icon">🔒</div>
              <h4>No Hidden Fees</h4>
              <p>Nyoma does not charge any hidden fees. You only pay what's stated above.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="slide-in-up">Why Choose Nyoma?</h2>
          <div className="features-grid">
            <div className="feature-card slide-in-left">
              <div className="feature-icon">⚡</div>
              <h4>Lightning Fast</h4>
              <p>Approval in minutes, funds in your account within hours</p>
            </div>
            <div className="feature-card slide-in-left">
              <div className="feature-icon">🎯</div>
              <h4>Transparent Fees</h4>
              <p>No hidden charges. Know exactly what you'll pay upfront</p>
            </div>
            <div className="feature-card slide-in-left">
              <div className="feature-icon">💚</div>
              <h4>Trustworthy</h4>
              <p>Licensed and regulated. Your data is secure with us</p>
            </div>
            <div className="feature-card slide-in-left">
              <div className="feature-icon">📱</div>
              <h4>100% Online</h4>
              <p>Apply, get approved, and receive funds on your phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="slide-in-up">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item slide-in-up">
              <h4>How quickly will I get my money?</h4>
              <p>Once approved, your loan is transferred to your M-Pesa within 2-4 hours.</p>
            </div>
            <div className="faq-item slide-in-up">
              <h4>What documents do I need?</h4>
              <p>Just a valid ID and phone number. Everything else is verified digitally.</p>
            </div>
            <div className="faq-item slide-in-up">
              <h4>Can I repay early?</h4>
              <p>Yes! Repay anytime without penalties. We reward early repayment.</p>
            </div>
            <div className="faq-item slide-in-up">
              <h4>Will this affect my credit score?</h4>
              <p>Nyoma reports to credit bureaus. Timely repayment improves your score.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content slide-in-up">
            <h2>Ready to get your loan?</h2>
            <p>Select a package above and complete your application</p>
            <button className="btn btn-primary btn-large">Get Started Today</button>
          </div>
        </div>
      </section>
    </div>
  );
}
