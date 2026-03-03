import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  SendIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'lucide-react';
import { contactService } from '../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactService.submitContact(formData);
      
      if (response.data) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Get in touch with our team for demos, support, or any questions about Easy Park.
            </p>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="input"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn btn-primary py-3"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner h-5 w-5 mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <SendIcon className="h-5 w-5 mr-2" />
                          Send Message
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-semibold text-gray-900">Get in Touch</h3>
                </div>
                <div className="card-body space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Office Location</h4>
                      <p className="text-gray-600">Bole, Addis Ababa<br />Ethiopia</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">+251 911 234 567</p>
                      <p className="text-gray-600">+251 116 789 012</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MailIcon className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@easypark.et</p>
                      <p className="text-gray-600">support@easypark.et</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-6 w-6 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-semibold text-gray-900">Follow Us</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 mb-4">Stay connected with us on social media for updates and news.</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                      <FacebookIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                      <TwitterIcon className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                      <LinkedinIcon className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                </div>
                <div className="card-body space-y-3">
                  <a href="/about" className="block text-primary-600 hover:text-primary-700 font-medium">
                    About Easy Park →
                  </a>
                  <a href="/services" className="block text-primary-600 hover:text-primary-700 font-medium">
                    Our Services →
                  </a>
                  <a href="/testimony" className="block text-primary-600 hover:text-primary-700 font-medium">
                    Customer Testimonials →
                  </a>
                  <a href="/login" className="block text-primary-600 hover:text-primary-700 font-medium">
                    Admin Login →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions? We've got answers. Here are some of the most common questions we receive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How much does Easy Park cost?</h3>
                <p className="text-gray-600">
                  Our pricing is based on a monthly subscription model that varies depending on the size of your parking facility. Contact us for a custom quote.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is technical support available?</h3>
                <p className="text-gray-600">
                  Yes! We provide 24/7 technical support to all our customers via phone, email, and live chat.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does setup take?</h3>
                <p className="text-gray-600">
                  Most installations are completed within 24-48 hours. We'll handle everything from setup to training.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I customize the rates?</h3>
                <p className="text-gray-600">
                  Absolutely! You have full control over pricing for different vehicle types and can adjust rates anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
