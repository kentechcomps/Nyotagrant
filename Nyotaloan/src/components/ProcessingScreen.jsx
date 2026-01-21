import { useEffect, useState } from 'react';
import '../styles/ProcessingScreen.css';

const processingSteps = [
  'Checking eligibility…',
  'Verifying applicant details…',
  'Contacting payment partner…',
  'Almost done…'
];

export default function ProcessingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 2500; // 2.5 seconds per step (10 seconds total for 4 steps)
    const totalDuration = processingSteps.length * stepDuration;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newStep = Math.floor((elapsed / stepDuration));
      
      if (newStep < processingSteps.length) {
        setCurrentStep(newStep);
        setProgress((newStep / processingSteps.length) * 100);
      }
    }, 100);

    const completionTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  return (
    <div className="processing-overlay">
      <div className="processing-screen slide-in-up">
        {/* M-Pesa Style Header */}
        <div className="processing-header">
          <div className="processing-icon">
            {progress < 100 ? (
              <div className="spinner"></div>
            ) : (
              <div className="check-mark">✓</div>
            )}
          </div>
        </div>

        {/* Status Text */}
        <h2 className="processing-title">
          {progress === 100 ? 'Request Received Successfully!' : 'Processing Your Request'}
        </h2>

        {/* Current Step */}
        <div className="processing-steps">
          {processingSteps.map((step, index) => (
            <div
              key={index}
              className={`step ${index <= currentStep ? 'active' : ''} ${
                index === currentStep ? 'current' : ''
              }`}
            >
              <span className="step-icon">
                {index < currentStep ? '✓' : index === currentStep ? '◆' : '○'}
              </span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Status Message */}
        {progress === 100 && (
          <div className="completion-message fade-in">
            <p>✓ Matched with available loan options</p>
            <p className="small-text">Redirecting to loan packages...</p>
          </div>
        )}
      </div>
    </div>
  );
}
