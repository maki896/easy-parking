# 🚀 Easy Park – Smart Parking Management Web Application

A full production-ready parking management web application with QR payments, per-minute billing, and comprehensive admin dashboard.

## 🌟 Features

- **Landing Website**: Professional public-facing site with Home, About, Services, Testimonials, and Contact pages
- **Admin Authentication**: Secure JWT-based login system (admin-only)
- **Vehicle Management**: Add/remove vehicles with automatic time tracking
- **Per-Minute Billing**: Precise fee calculation based on vehicle type
- **QR Payment Integration**: Chapa payment gateway with QR code generation
- **Real-Time Dashboard**: Live vehicle tracking and revenue monitoring
- **Advanced Reports**: Daily, weekly, monthly, and yearly analytics with graphs
- **CSV Export**: Download comprehensive reports
- **MongoDB Integration**: Scalable database solution
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠 Technology Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios
- QRCode.js
- Chart.js
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
- CORS
- dotenv

### Payment
- Chapa Payment Gateway (Test Mode)
- QR Code Generation

## 🚗 Vehicle Pricing

- **Car**: 1 ETB per minute
- **Motorcycle**: 0.50 ETB per minute
- **Truck**: 1.50 ETB per minute

## 📁 Project Structure

```
easyparking/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── README.md          # This file
└── .env.example       # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas or local MongoDB
- Chapa API keys (test mode)

### Installation

1. **Clone the repository**
2. **Install backend dependencies**
3. **Install frontend dependencies**
4. **Set up environment variables**
5. **Start the development servers**

### Environment Variables

Create `.env` files in both frontend and backend directories with the required variables.

## 🔐 Admin Access

Default admin credentials will be created during initial setup. Only admin role is supported.

## 💳 Payment Integration

The system uses Chapa payment gateway in test mode. QR codes are generated for secure payments.

## 📊 Reports & Analytics

Comprehensive reporting with:
- Daily/Weekly/Monthly/Yearly revenue
- Vehicle statistics
- Payment status tracking
- CSV export functionality

## 🌐 Live Demo

The application includes a complete landing website and admin dashboard with professional UI/UX.

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Admin-only route protection
- Secure payment processing

## 📈 Production Ready

The application is structured for production deployment with:
- Environment variable configuration
- MongoDB Atlas support
- Optimized build process
- Error handling and logging

---

Built with ❤️ for Ethiopian parking management needs
