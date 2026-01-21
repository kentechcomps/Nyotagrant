# Nyoma Loan Server

Flask backend API for the Nyoma loan application platform.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

### 3. Run the Server

```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /` - Server status
- `GET /api/health` - Health check

### Loan Applications
- `POST /api/applications` - Create new application
- `GET /api/applications/<app_id>` - Get application details

### M-Pesa Payments
- `POST /api/payments/mpesa/initiate` - Initiate M-Pesa payment
- `POST /api/payments/mpesa/callback` - M-Pesa payment callback

### Paystack Payments
- `POST /api/payments/paystack/initialize` - Initialize Paystack payment
- `GET /api/payments/paystack/verify/<reference>` - Verify Paystack payment

### Loan Packages
- `GET /api/packages` - Get available loan packages

## File Structure

```
Server/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:5000/

# Get loan packages
curl http://localhost:5000/api/packages

# Create application
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","loanReason":"Business"}'
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| FLASK_ENV | development or production |
| PORT | Server port (default: 5000) |
| MPESA_API_KEY | M-Pesa API key |
| PAYSTACK_SECRET_KEY | Paystack secret key |
| DATABASE_URL | Database connection string |

## Next Steps

- [ ] Connect to database (SQLAlchemy)
- [ ] Implement M-Pesa Daraja API integration
- [ ] Implement Paystack API integration
- [ ] Add authentication (JWT)
- [ ] Add loan approval logic
- [ ] Add user management
- [ ] Deploy to production

---

*Built for Nyoma Loan Platform | Flask + CORS | Production-Ready*
