import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldIcon,
  ClockIcon,
  DollarSignIcon,
  CarIcon,
  CheckCircleIcon,
  UsersIcon,
  GlobeIcon,
  HeartIcon,
  BikeIcon,
  TruckIcon
} from 'lucide-react';

const About = () => {
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
      icon: ShieldIcon,
      title: 'Secure QR Payments',
      description: 'Our QR code payment system integrates with Chapa to provide secure, cashless transactions that protect both customers and parking operators.',
      details: ['End-to-end encryption', 'Instant payment confirmation', 'Digital receipts', 'Fraud protection']
    },
    {
      icon: ClockIcon,
      title: 'Real-Time Vehicle Tracking',
      description: 'Monitor every vehicle in your facility with our advanced tracking system that provides accurate entry/exit times and status updates.',
      details: ['Live monitoring dashboard', 'Automatic time tracking', 'Vehicle history logs', 'Status notifications']
    },
    {
      icon: DollarSignIcon,
      title: 'Smart Revenue Reports',
      description: 'Get comprehensive insights into your parking revenue with detailed analytics, trends, and customizable reporting features.',
      details: ['Daily/weekly/monthly reports', 'Revenue analytics', 'Vehicle type breakdown', 'CSV export functionality']
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Vehicle Entry',
      description: 'When a vehicle enters, the admin records the plate number, vehicle type, and optional color. The system automatically logs the entry time.',
      icon: CarIcon
    },
    {
      step: 2,
      title: 'Duration Tracking',
      description: 'Our system tracks the exact duration using per-minute billing. Rates are automatically applied based on vehicle type.',
      icon: ClockIcon
    },
    {
      step: 3,
      title: 'QR Payment',
      description: 'When exiting, generate a QR code for secure payment via Chapa. Customers can scan and pay instantly using mobile money.',
      icon: DollarSignIcon
    },
    {
      step: 4,
      title: 'Completion',
      description: 'Once payment is confirmed, the vehicle record is marked as completed. All data is stored in MongoDB for reporting.',
      icon: CheckCircleIcon
    }
  ];

  const stats = [
    { label: 'Years of Experience', value: '5+', icon: ClockIcon },
    { label: 'Happy Clients', value: '500+', icon: UsersIcon },
    { label: 'Vehicles Managed', value: '50K+', icon: CarIcon },
    { label: 'Transactions Processed', value: '1M+', icon: GlobeIcon }
  ];

  return (
    <div className="min-h-screen">
      <style>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
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
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Easy Park</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              We're revolutionizing parking management in Ethiopia with innovative technology, 
              secure payments, and data-driven insights that help businesses thrive.
            </p>
          </div>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive parking management solution includes everything you need 
              to run your parking facility efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="scroll-animate card p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" style={{transitionDelay: `${index * 100}ms`}}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full mb-6 shadow-sm">
                  <feature.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-teal-600 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple four-step process makes parking management effortless for both 
              operators and customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 -translate-x-1/2"></div>
                  )}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <step.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To transform parking management across Ethiopia by providing affordable, 
                accessible, and innovative technology solutions that help businesses operate 
                more efficiently while delivering exceptional customer experiences.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that modern technology should be accessible to everyone, which is 
                why we've designed Easy Park specifically for the Ethiopian market with local 
                payment integration, affordable pricing, and 24/7 local support.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/contact"
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
                <Link
                  to="/services"
                  className="btn btn-outline"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🇪🇹</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Made for Ethiopia</h3>
              <p className="text-gray-700">
                Proudly Ethiopian with solutions tailored to local needs and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 text-white scroll-animate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <HeartIcon className="h-8 w-8 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Parking Business?
            </h2>
          </div>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of parking facilities across Ethiopia that have already 
            streamlined their operations with Easy Park.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Request Demo
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
