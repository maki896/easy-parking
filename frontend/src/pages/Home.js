import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CarIcon,
  QrCodeIcon,
  TrendingUpIcon,
  ShieldIcon,
  ClockIcon,
  DollarSignIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CreditCardIcon,
  BarChart3Icon,
  UsersIcon,
  ZapIcon,
  ParkingSquareIcon,
  ActivityIcon
} from 'lucide-react';
import { capacityService } from '../services/capacityService';

const Home = () => {
  const [capacity, setCapacity] = useState(null);
  const [loadingCapacity, setLoadingCapacity] = useState(true);

  useEffect(() => {
    // Fetch initial capacity data
    fetchCapacity();

    // Auto-refresh capacity every 30 seconds
    const interval = setInterval(fetchCapacity, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchCapacity = async () => {
    try {
      const response = await capacityService.getCurrentCapacity();
      setCapacity(response.data);
      setLoadingCapacity(false);
    } catch (error) {
      console.error('Failed to fetch capacity:', error);
      setLoadingCapacity(false);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const vehicleTypes = [
    {
      icon: '🏍️',
      title: 'Motorcycles',
      description: 'Perfect storage solution for motorcycles and bikes with secure parking spaces.',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: '🚗',
      title: 'Cars',
      description: 'Spacious and safe parking for all types of cars including sedans and SUVs.',
      gradient: 'from-teal-400 to-teal-600'
    },
    {
      icon: '🚛',
      title: 'Trucks',
      description: 'Large capacity parking areas designed for trucks and commercial vehicles.',
      gradient: 'from-amber-400 to-amber-600'
    }
  ];

  const features = [
    {
      icon: QrCodeIcon,
      title: 'Secure QR Payments',
      description: 'Fast and secure QR code payments with Chapa integration. No cash needed, just scan and pay.',
      color: 'from-teal-400 to-teal-600'
    },
    {
      icon: BarChart3Icon,
      title: 'Smart Analytics',
      description: 'Comprehensive analytics with daily, weekly, monthly, and yearly revenue insights and trends.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: CarIcon,
      title: 'Vehicle Tracking',
      description: 'Track all vehicles in real-time with automatic entry/exit time recording and status monitoring.',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: ZapIcon,
      title: 'Lightning Fast',
      description: 'Quick vehicle registration and checkout process. Get your customers in and out efficiently.',
      color: 'from-amber-400 to-amber-600'
    },
  ];

  return (
    <div className="min-h-screen">
      <style>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-image-container {
          position: relative;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: scale(1.05);
        }
        .cta-button {
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .typing-text {
          overflow: hidden;
          border-right: 3px solid #0d9488;
          white-space: nowrap;
          animation: typing 2s steps(30, end), blink-caret 0.75s step-end infinite;
          display: inline-block;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #0d9488; }
        }
        .vehicle-card {
          transition: all 0.4s ease;
        }
        .vehicle-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden pt-8 md:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-block">
                <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                  🚀 Modern Parking Solution
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Car Parking and
                <span className="block text-teal-600 typing-text">Management System</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Transform your parking facility with our comprehensive management solution. 
                Real-time tracking, QR payments, and detailed analytics - all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="cta-button inline-flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg"
                >
                  Get Started
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-teal-600 hover:text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="hero-image-container relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/my1.png"
                  alt="Easy Parking Facility"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-200 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Parking Availability Section */}
      <section className="py-16 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <ActivityIcon className="h-4 w-4 mr-2" />
              Live Updates Every 30 Seconds
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🅿️ Parking Availability
            </h2>
            <p className="text-xl text-teal-100">
              Real-time parking slot availability - Check before you arrive!
            </p>
          </div>

          {loadingCapacity ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner h-12 w-12 border-white"></div>
            </div>
          ) : capacity ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Total Capacity */}
              <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <ParkingSquareIcon className="h-12 w-12 text-teal-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                    <p className="text-4xl font-bold text-gray-900">{capacity.totalCapacity}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-center">Parking Slots</p>
              </div>

              {/* Available Slots */}
              <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircleIcon className="h-12 w-12 text-green-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Available Now</p>
                    <p className="text-4xl font-bold text-green-600">{capacity.availableSlots}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-center">Free Slots</p>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUpIcon className="h-12 w-12 text-orange-600" />
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Occupancy</p>
                    <p className={`text-4xl font-bold ${
                      capacity.occupancyPercentage >= 90 ? 'text-red-600' :
                      capacity.occupancyPercentage >= 75 ? 'text-orange-600' :
                      capacity.occupancyPercentage >= 50 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{capacity.occupancyPercentage}%</p>
                  </div>
                </div>
                <p className="text-gray-600 text-center">Utilization</p>
              </div>
            </div>
          ) : (
            <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 text-center">
              <p className="text-gray-600">Unable to load parking availability</p>
            </div>
          )}

          {/* Visual Progress Bar */}
          {capacity && (
            <div className="mt-8 bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Current Status</h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  capacity.isFull ? 'bg-red-100 text-red-800' :
                  capacity.occupancyPercentage >= 75 ? 'bg-orange-100 text-orange-800' :
                  capacity.occupancyPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {capacity.isFull ? '🔴 FULL' :
                   capacity.occupancyPercentage >= 75 ? '🟠 High Occupancy' :
                   capacity.occupancyPercentage >= 50 ? '🟡 Moderate' :
                   '🟢 Available'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm font-medium mb-3">
                <span className="text-gray-600">Occupied: {capacity.currentOccupied} vehicles</span>
                <span className="text-gray-600">Available: {capacity.availableSlots} slots</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold ${
                    capacity.occupancyPercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    capacity.occupancyPercentage >= 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    capacity.occupancyPercentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${capacity.occupancyPercentage}%` }}
                >
                  {capacity.occupancyPercentage > 10 && `${capacity.occupancyPercentage}%`}
                </div>
              </div>
              
              {capacity.isFull && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-center font-medium">⚠️ Parking lot is currently full. Please check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Vehicle Types Section - 3 Images in Row */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Store All <span className="text-teal-600">Vehicle Types</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From motorcycles to trucks, our parking facility accommodates all types of vehicles 
              with secure and spacious parking areas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={index} 
                className="vehicle-card scroll-animate bg-white rounded-3xl p-8 shadow-xl"
                style={{transitionDelay: `${index * 150}ms`}}
              >
                <div className={`w-full h-48 bg-gradient-to-br ${vehicle.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="text-8xl">{vehicle.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{vehicle.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{vehicle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features for <span className="text-teal-600">Modern Parking</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive parking management solution is designed to make parking operations 
              efficient, secure, and profitable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card scroll-animate bg-white rounded-2xl p-8 shadow-lg`} style={{transitionDelay: `${index * 100}ms`}}>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 shadow-md`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section with Text */}
      <section className="py-20 bg-white scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="/images/cs.png"
                  alt="Customer Service"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Designed for Your Success
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our parking management system is built with modern technology to ensure 
                smooth operations and happy customers.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time vehicle monitoring',
                  'Automated payment processing',
                  'Detailed revenue analytics',
                  'Mobile-friendly interface',
                  'Secure data management',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 text-white scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Parking Management?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of parking facilities that have already streamlined their operations 
            with Easy Park's smart management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="cta-button inline-flex items-center justify-center bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg"
            >
              Request Demo
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Ethiopian Businesses
              </h2>
              <div className="space-y-4">
                {[
                  'Local payment integration with Chapa',
                  'Support for Ethiopian Birr (ETB)',
                  'Designed for local parking regulations',
                  '24/7 local support and maintenance',
                  'Affordable pricing for Ethiopian market',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl p-12 text-center shadow-xl">
              <div className="text-7xl mb-4">🇪🇹</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Made for Ethiopia</h3>
              <p className="text-gray-700 text-lg">
                Proudly serving Ethiopian businesses with solutions tailored to local needs and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
