import React from 'react';
import { Target, Users, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">About Bali & Partners</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We bridge the gap between legal expertise and digital excellence, creating content 
            that resonates with your audience while establishing thought leadership.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div className="text-center group">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 
                          group-hover:bg-blue-100 transition-colors duration-300">
              <Target className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower legal professionals and firms with strategic digital content that 
              drives meaningful engagement and business growth.
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 
                          group-hover:bg-amber-100 transition-colors duration-300">
              <Users className="text-amber-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Integrity, innovation, and excellence guide every piece of content we create, 
              ensuring authenticity and impact in every project.
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 
                          group-hover:bg-green-100 transition-colors duration-300">
              <Lightbulb className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the leading digital strategy partner for legal professionals 
              seeking to amplify their expertise and reach.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <img 
              src="https://i.ibb.co/whSCS4Gm/IMG-6865.jpg" 
              alt="Shashwat Bali - Founder, Bali & Partners"
              className="w-64 h-64 rounded-full mx-auto mb-6 object-cover shadow-lg"
            />
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">Founder's Story</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            Shashwat Bali is a legal strategist with deep-rooted experience working alongside leading litigators, top-tier firms, and legal professionals across practice areas. With a sharp understanding of law and branding, he founded Bali & Partners to bridge the gap between legal expertise and digital visibility. Backed by industry insight and a strong professional network, he helps law firms and lawyers build authority through content that ranks, resonates, and leads.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
