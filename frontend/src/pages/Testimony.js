import React from 'react';
import { Link } from 'react-router-dom';
import {
  StarIcon,
  QuoteIcon,
  UsersIcon,
  BuildingIcon,
  CarIcon,
  CheckCircleIcon
} from 'lucide-react';

const Testimony = () => {
  const testimonials = [
    {
      id: 1,
      name: "Abebe Kebede",
      role: "Parking Manager",
      company: "Addis Ababa Shopping Mall",
      avatar: "👨‍💼",
      rating: 5,
      testimonial: "Easy Park has transformed our parking operations. The QR payment system is incredibly convenient for our customers, and the real-time dashboard helps us manage capacity efficiently. We've seen a 40% increase in payment collection rates since implementation.",
      highlights: [
        "40% increase in payment collection",
        "Reduced customer wait times",
        "Excellent support team"
      ],
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: 2,
      name: "Sara Tesfaye",
      role: "Business Owner",
      company: "Sara's Restaurant & Cafe",
      avatar: "👩‍💼",
      rating: 5,
      testimonial: "As a small business owner, I needed something affordable and easy to use. Easy Park exceeded my expectations. The per-minute billing is fair to customers, and the automated reporting saves me hours of administrative work each week.",
      highlights: [
        "Affordable pricing structure",
        "Simple to use interface",
        "Time-saving automation"
      ],
      location: "Bahir Dar, Ethiopia"
    },
    {
      id: 3,
      name: "Dawit Haile",
      role: "Customer",
      company: "Regular User",
      avatar: "👤",
      rating: 5,
      testimonial: "I love the QR payment system! No more fumbling for cash or waiting in long queues. I can pay instantly from my phone and get a digital receipt. The parking rates are also very reasonable compared to other facilities in the city.",
      highlights: [
        "Quick and easy payments",
        "Digital receipts",
        "Competitive pricing"
      ],
      location: "Hawassa, Ethiopia"
    }
  ];

  const stats = [
    { label: "Happy Clients", value: "500+", icon: UsersIcon },
    { label: "Vehicles Managed Daily", value: "10,000+", icon: CarIcon },
    { label: "Business Locations", value: "50+", icon: BuildingIcon },
    { label: "Customer Satisfaction", value: "98%", icon: StarIcon }
  ];

  const StarRating = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`h-5 w-5 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const TestimonialCard = ({ testimonial }) => (
    <div className="card p-8 hover:shadow-xl transition-all duration-300 relative">
      <div className="absolute top-4 right-4">
        <QuoteIcon className="h-8 w-8 text-primary-200" />
      </div>
      
      <div className="flex items-start space-x-4 mb-6">
        <div className="text-4xl">{testimonial.avatar}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
          <p className="text-gray-600">{testimonial.role}</p>
          <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
          <div className="mt-2">
            <StarRating rating={testimonial.rating} />
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed mb-6 italic">
        "{testimonial.testimonial}"
      </p>
      
      <div className="space-y-2 mb-4">
        {testimonial.highlights.map((highlight, index) => (
          <div key={index} className="flex items-center text-sm">
            <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600">{highlight}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <span>📍 {testimonial.location}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Testimonials</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Hear from parking managers, business owners, and customers who have transformed 
              their parking experience with Easy Park.
            </p>
          </div>
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

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real customers who have experienced the Easy Park difference.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Easy Park has helped businesses across Ethiopia transform their parking operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Case Study 1 */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Shopping Mall Transformation</h3>
                <p className="text-sm text-gray-500">Addis Ababa Shopping Mall</p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                    <p className="text-gray-600 text-sm">
                      Manual parking management, long queues, revenue leakage, and poor customer experience.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                    <p className="text-gray-600 text-sm">
                      Implemented Easy Park with QR payments, real-time tracking, and automated reporting.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        40% increase in revenue collection
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        60% reduction in customer wait times
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        95% customer satisfaction rate
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Restaurant Efficiency Boost</h3>
                <p className="text-sm text-gray-500">Sara's Restaurant & Cafe</p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                    <p className="text-gray-600 text-sm">
                      Limited parking space, customer complaints about payment process, manual tracking.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Solution</h4>
                    <p className="text-gray-600 text-sm">
                      Deployed Easy Park with mobile payments and efficient space management.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Results</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        25% improvement in parking turnover
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        Zero payment processing errors
                      </li>
                      <li className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-success-500 mr-2" />
                        10 hours/week saved on administration
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Various Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Easy Park serves diverse parking needs across different industries and locations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🏬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopping Malls</h3>
              <p className="text-gray-600 text-sm">High-volume parking with automated management</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospitals</h3>
              <p className="text-gray-600 text-sm">Reliable parking for patients and visitors</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotels</h3>
              <p className="text-gray-600 text-sm">Guest parking with seamless integration</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office Buildings</h3>
              <p className="text-gray-600 text-sm">Employee and visitor parking solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Success Stories
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Ready to transform your parking operations? Join hundreds of satisfied customers 
            who have already made the switch to Easy Park.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Your Success Story
            </Link>
            <Link
              to="/services"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimony;
