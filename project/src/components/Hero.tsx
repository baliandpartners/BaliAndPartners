import React from 'react';
import { ArrowRight, Award } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="pt-20 pb-16 min-h-screen flex items-center relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/70"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          {/* Agency Name */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Bali & Partners
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-blue-200 mb-8 font-light">
            Legal Content & Digital Strategy Agency
          </p>
          
          {/* Value Proposition */}
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transforming legal expertise into compelling digital narratives that drive engagement, 
            build authority, and accelerate business growth.
          </p>
          
          {/* Primary CTA */}
          <button 
            onClick={scrollToContact}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium 
                     hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl inline-flex items-center group"
          >
            Start Your Digital Journey
            <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;