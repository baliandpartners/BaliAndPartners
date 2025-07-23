import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your legal practice with strategic digital content? 
            Let's discuss how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="text-blue-600 mt-1 mr-4" size={20} />
                <div>
                  <p className="font-medium text-slate-800">Email</p>
                  <p className="text-gray-600">Shashwat@baliandpartners.in</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-blue-600 mt-1 mr-4" size={20} />
                <div>
                  <p className="font-medium text-slate-800">Phone</p>
                  <p className="text-gray-600">+91 82690 26882</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="text-blue-600 mt-1 mr-4" size={20} />
                <div>
                  <p className="font-medium text-slate-800">Location</p>
                  <p className="text-gray-600">New Delhi, India</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3">Legal Information</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Bali & Partners is a registered legal content and digital strategy agency. 
                All services are provided in compliance with applicable laws and regulations.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-800 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-slate-800 mb-2">
                  Law Firm/Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your law firm or company"
                />
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium text-slate-800 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your project and how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium 
                         hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 
                         shadow-lg hover:shadow-xl inline-flex items-center justify-center group"
              >
                Send Message
                <Send className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;