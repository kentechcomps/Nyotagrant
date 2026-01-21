import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import ProcessingScreen from '../components/ProcessingScreen';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please tell us why you need the loan';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Please provide more details (at least 10 characters)';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setShowProcessing(true);
    
    // Store form data in sessionStorage for next page
    sessionStorage.setItem('applicantData', JSON.stringify(formData));
  };

  const handleProcessingComplete = () => {
    setShowProcessing(false);
    setLoading(false);
    navigate('/loan-packages');
  };

  return (
    <div className="home">
      {/* Processing Screen Modal */}
      {showProcessing && <ProcessingScreen onComplete={handleProcessingComplete} />}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content slide-in-up">
          <img src="/nyotalogo.png" alt="Nyota Logo" className="hero-logo" />
          <h1 className="hero-title">Nyota</h1>
          <p className="hero-tagline">Instant loans. Simple. Secure. Reliable.</p>
          <p className="hero-subtitle">Apply in minutes and get processed instantly.</p>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="form-section">
        <div className="container">
          <div className="form-card slide-in-up">
            <h2>Apply for a Loan</h2>
            <p className="form-description">Tell us about yourself and your loan needs</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Names</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Mwangi"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Loan</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us what you need the loan for..."
                  rows="4"
                  className={errors.reason ? 'error' : ''}
                />
                {errors.reason && <span className="error-message">{errors.reason}</span>}
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Apply Now'}
                </button>
              </div>
            </form>
          </div>

          {/* M-Pesa CTA */}
          <div className="mpesa-cta slide-in-up">
            <div className="mpesa-badge">
              <span className="mpesa-icon">💳</span>
              <h3>Receive via M-Pesa</h3>
              <p>Get your approved loan directly to your M-Pesa account instantly</p>
              <button className="btn btn-mpesa">Proceed with M-Pesa</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
