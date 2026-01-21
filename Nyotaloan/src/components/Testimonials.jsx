import { useState, useEffect } from 'react';
import '../styles/Testimonials.css';

const fakeTestimonials = [
  {
    id: 1,
    name: 'James Kipchoge',
    message: 'Nyoma: Dear James, your loan of KES 10,000 has been approved. Amount received successfully. Thank you for choosing Nyoma.',
    isNyoma: true,
    avatar: '💬'
  },
  {
    id: 2,
    name: 'Sarah Mwangi',
    message: 'I applied and received my loan the same day. Very fast and reliable!',
    isNyoma: false,
    avatar: '👩‍💼'
  },
  {
    id: 3,
    name: 'Grace Ochieng',
    message: 'Nyoma: Grace, your payment of KES 150 has been confirmed. Processing your application now.',
    isNyoma: true,
    avatar: '💬'
  },
  {
    id: 4,
    name: 'David Kariuki',
    message: 'Processing fee was very clear and affordable. No hidden charges at all!',
    isNyoma: false,
    avatar: '👨‍💻'
  },
  {
    id: 5,
    name: 'Lisa Njoki',
    message: 'Nyoma: Lisa, your account is verified. Ready to proceed. Tap below to continue.',
    isNyoma: true,
    avatar: '💬'
  },
  {
    id: 6,
    name: 'Peter Mwangi',
    message: 'The whole process from application to receiving funds took less than 30 minutes!',
    isNyoma: false,
    avatar: '👨‍🎨'
  }
];

export default function Testimonials() {
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);

  useEffect(() => {
    let testimonialIndex = 0;
    let timeout;

    const showNextTestimonial = () => {
      const randomDelay = Math.random() * 2000 + 3000; // 3-5 seconds between testimonials
      
      timeout = setTimeout(() => {
        const currentTestimonial = fakeTestimonials[testimonialIndex % fakeTestimonials.length];
        
        setDisplayedTestimonials(prev => {
          const updated = [...prev, currentTestimonial];
          // Keep only last 3 testimonials on screen
          return updated.slice(-3);
        });

        testimonialIndex++;
        showNextTestimonial();
      }, randomDelay);
    };

    showNextTestimonial();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header slide-in-up">
          <h2>What Our Customers Say</h2>
          <p>Join thousands of satisfied borrowers</p>
        </div>

        <div className="testimonials-container">
          {displayedTestimonials.map((testimonial, index) => (
            <div 
              key={`${testimonial.id}-${index}`} 
              className={`testimonial-bubble slide-in-left ${testimonial.isNyoma ? 'nyoma-message' : 'user-message'}`}
            >
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <div className="testimonial-content">
                {testimonial.isNyoma && <p className="testimonial-sender">Nyoma</p>}
                <p className="testimonial-message">{testimonial.message}</p>
                <p className="testimonial-name">
                  {!testimonial.isNyoma && `— ${testimonial.name}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
