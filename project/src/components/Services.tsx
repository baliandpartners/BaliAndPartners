import React from 'react';
import { FileText, Edit3, Search, Linkedin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: 'Legal Content',
      description: 'Expert legal content creation that simplifies complex concepts for your audience.',
      color: 'blue'
    },
    {
      icon: Edit3,
      title: 'Ghostwriting',
      description: 'Professional ghostwriting services that capture your unique voice and expertise.',
      color: 'green'
    },
    {
      icon: Search,
      title: 'SEO for Law',
      description: 'Strategic SEO optimization tailored specifically for legal practices and firms.',
      color: 'purple'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Branding',
      description: 'Complete LinkedIn presence optimization to establish thought leadership.',
      color: 'amber'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 group-hover:bg-blue-100 text-blue-600',
      green: 'bg-green-50 group-hover:bg-green-100 text-green-600',
      purple: 'bg-purple-50 group-hover:bg-purple-100 text-purple-600',
      amber: 'bg-amber-50 group-hover:bg-amber-100 text-amber-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions designed specifically for legal professionals 
            and firms seeking to enhance their online presence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-all duration-300 
                       transform hover:-translate-y-1 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 
                             transition-colors duration-300 ${getColorClasses(service.color)}`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;