import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CarIcon,
  QrCodeIcon,
  TrendingUpIcon,
  ShieldIcon,
  ClockIcon,
  DollarSignIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: QrCodeIcon,
      title: 'Secure QR Payments',
      description: 'Fast and secure QR code payments with Chapa integration. No cash needed, just scan and pay.',
    },
    {
      icon: CarIcon,
      title: 'Real-Time Vehicle Tracking',
      description: 'Track all vehicles in real-time with automatic entry/exit time recording and status monitoring.',
    },
    {
      icon: TrendingUpIcon,
      title: 'Smart Revenue Reports',
      description: 'Comprehensive analytics with daily, weekly, monthly, and yearly revenue insights and trends.',
    },
  ];

  const stats = [
    { label: 'Vehicles Managed', value: '10,000+', icon: CarIcon },
    { label: 'Payments Processed', value: 'ETB 500K+', icon: DollarSignIcon },
    { label: 'Uptime', value: '99.9%', icon: ClockIcon },
    { label: 'Secure Transactions', value: '100%', icon: ShieldIcon },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Smart Parking Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Transform your parking management with our comprehensive solution. 
              QR payments, real-time tracking, and detailed analytics - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white opacity-10 rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Easy Park?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive parking management solution is designed to make parking operations 
              efficient, secure, and profitable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent Per-Minute Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fair and transparent pricing with per-minute billing. Pay only for the time you use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Car</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">1 ETB</div>
              <p className="text-gray-600">per minute</p>
            </div>
            
            <div className="card p-8 text-center hover:shadow-lg transition-shadow border-2 border-primary-500">
              <div className="text-4xl mb-4">🏍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Motorcycle</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">0.50 ETB</div>
              <p className="text-gray-600">per minute</p>
            </div>
            
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚛</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Truck</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">1.50 ETB</div>
              <p className="text-gray-600">per minute</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Parking Management?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of parking facilities that have already streamlined their operations 
            with Easy Park's smart management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Request Demo
            </Link>
            <Link
              to="/about"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
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
                    <CheckCircleIcon className="h-6 w-6 text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🇪🇹</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Made for Ethiopia</h3>
              <p className="text-gray-700">
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
