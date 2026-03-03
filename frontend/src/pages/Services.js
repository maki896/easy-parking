import React from 'react';
import { Link } from 'react-router-dom';
import {
  CarIcon,
  DollarSignIcon,
  ClockIcon,
  ShieldIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
  BarChart3Icon,
  QrCodeIcon,
  SmartphoneIcon
} from 'lucide-react';

const Services = () => {
  const vehicleTypes = [
    {
      type: 'Car',
      icon: '🚗',
      rate: '1 ETB',
      period: 'per minute',
      description: 'Standard passenger vehicles including sedans, SUVs, and hatchbacks',
      features: [
        'Real-time tracking',
        'Secure QR payment',
        'Digital receipts',
        '24/7 monitoring'
      ],
      examples: 'Toyota, Hyundai, Volkswagen, etc.',
      color: 'blue'
    },
    {
      type: 'Motorcycle',
      icon: '🏍️',
      rate: '0.50 ETB',
      period: 'per minute',
      description: 'Two-wheeled vehicles including motorcycles and scooters',
      features: [
        'Compact tracking',
        'Quick payment processing',
        'Mobile-friendly access',
        'Fast exit processing'
      ],
      examples: 'Bajaj, Honda, Yamaha, etc.',
      color: 'yellow'
    },
    {
      type: 'Truck',
      icon: '🚛',
      rate: '1.50 ETB',
      period: 'per minute',
      description: 'Large commercial vehicles including trucks, vans, and buses',
      features: [
        'Heavy-duty tracking',
        'Extended parking support',
        'Bulk payment options',
        'Priority processing'
      ],
      examples: 'Isuzu, Mercedes Trucks, etc.',
      color: 'green'
    }
  ];

  const features = [
    {
      icon: QrCodeIcon,
      title: 'QR Code Payments',
      description: 'Scan and pay instantly using your mobile phone with our secure QR payment system powered by Chapa.',
      benefits: ['No cash needed', 'Instant confirmation', 'Digital receipts', 'Secure transactions']
    },
    {
      icon: ClockIcon,
      title: 'Per-Minute Billing',
      description: 'Fair and transparent pricing with per-minute billing. Pay only for the exact time you park.',
      benefits: ['Precise timing', 'Fair pricing', 'Automatic calculation', 'No hidden fees']
    },
    {
      icon: BarChart3Icon,
      title: 'Real-Time Analytics',
      description: 'Monitor your parking operations in real-time with comprehensive dashboards and reports.',
      benefits: ['Live monitoring', 'Revenue tracking', 'Vehicle statistics', 'Custom reports']
    },
    {
      icon: SmartphoneIcon,
      title: 'Mobile Friendly',
      description: 'Access your parking dashboard from any device with our responsive web application.',
      benefits: ['Works on all devices', 'No app installation', 'Instant access', 'Cloud-based']
    }
  ];

  const benefits = [
    {
      icon: TrendingUpIcon,
      title: 'Increase Revenue',
      description: 'Optimize your pricing and reduce revenue leakage with our automated tracking and payment system.'
    },
    {
      icon: UsersIcon,
      title: 'Better Customer Experience',
      description: 'Provide fast, convenient service with QR payments and digital receipts that customers love.'
    },
    {
      icon: ShieldIcon,
      title: 'Enhanced Security',
      description: 'Protect your business and customers with secure payments, encrypted data, and audit trails.'
    },
    {
      icon: ClockIcon,
      title: 'Save Time',
      description: 'Automate manual processes and reduce administrative overhead with our streamlined system.'
    }
  ];

  const RateCard = ({ vehicle }) => (
    <div className={`card p-8 hover:shadow-xl transition-all duration-300 border-2 ${
      vehicle.color === 'blue' ? 'border-blue-200 hover:border-blue-400' :
      vehicle.color === 'yellow' ? 'border-yellow-200 hover:border-yellow-400' :
      'border-green-200 hover:border-green-400'
    }`}>
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">{vehicle.icon}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.type}</h3>
        <div className="text-3xl font-bold text-primary-600 mb-1">{vehicle.rate}</div>
        <div className="text-sm text-gray-500">{vehicle.period}</div>
      </div>
      
      <p className="text-gray-600 mb-6 text-center">{vehicle.description}</p>
      
      <div className="space-y-3 mb-6">
        {vehicle.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-4">
          <strong>Examples:</strong> {vehicle.examples}
        </p>
        <Link
          to="/contact"
          className={`w-full btn ${
            vehicle.color === 'blue' ? 'btn-primary' :
            vehicle.color === 'yellow' ? 'btn-secondary' :
            'btn-success'
          }`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services & Pricing</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Transparent per-minute pricing for all vehicle types with secure QR payments 
              and comprehensive parking management solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Types Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vehicle Type Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fair and transparent pricing with per-minute billing. 
              No hidden fees, no minimum charges - pay only for what you use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <RateCard key={index} vehicle={vehicle} />
            ))}
          </div>

          {/* Pricing Examples */}
          <div className="mt-16 card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Examples</h3>
            </div>
            <div className="card-body">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">🚗 Car</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>30 minutes:</span>
                      <span className="font-semibold">ETB 30.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 hour:</span>
                      <span className="font-semibold">ETB 60.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 hours:</span>
                      <span className="font-semibold">ETB 120.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">🏍️ Motorcycle</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>30 minutes:</span>
                      <span className="font-semibold">ETB 15.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 hour:</span>
                      <span className="font-semibold">ETB 30.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 hours:</span>
                      <span className="font-semibold">ETB 60.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-4">🚛 Truck</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>30 minutes:</span>
                      <span className="font-semibold">ETB 45.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 hour:</span>
                      <span className="font-semibold">ETB 90.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2 hours:</span>
                      <span className="font-semibold">ETB 180.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your parking facility efficiently and securely.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-500">
                      <StarIcon className="h-3 w-3 text-yellow-500 mr-1 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Easy Park?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your parking operations with our comprehensive management solution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-6">
                  <benefit.icon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Seamless Integration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Easy Park integrates with Chapa, Ethiopia's leading payment gateway, 
                to provide secure and reliable payment processing for your customers.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Chapa Payment Gateway</h4>
                    <p className="text-gray-600">Secure mobile money and card payments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">MongoDB Database</h4>
                    <p className="text-gray-600">Scalable and reliable data storage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Cloud-Based Infrastructure</h4>
                    <p className="text-gray-600">Access from anywhere, anytime</p>
                  </div>
                </div>
              </div>
              <Link
                to="/contact"
                className="btn btn-primary"
              >
                Learn About Integration
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
              <div className="text-6xl mb-4 text-center">🔗</div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Connected Ecosystem
              </h3>
              <p className="text-gray-700 text-center">
                Our platform works seamlessly with payment providers, 
                databases, and cloud services to deliver a complete solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join parking facilities across Ethiopia that are already using Easy Park 
            to streamline their operations and increase revenue.
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
    </div>
  );
};

export default Services;
