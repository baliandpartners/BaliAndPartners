import React from 'react';
import { GraduationCap, Award, Users } from 'lucide-react';

const FounderHighlight = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-8">Meet Our Founder</h3>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <GraduationCap className="mx-auto mb-4 text-amber-400" size={32} />
                <h4 className="font-semibold mb-2">Legal Education</h4>
                <p className="text-gray-300">Symbiosis Law School</p>
              </div>
              <div className="text-center">
                <Award className="mx-auto mb-4 text-amber-400" size={32} />
                <h4 className="font-semibold mb-2">Expertise</h4>
                <p className="text-gray-300">Legal Content & Digital Strategy</p>
              </div>
              <div className="text-center">
                <Users className="mx-auto mb-4 text-amber-400" size={32} />
                <h4 className="font-semibold mb-2">Vision</h4>
                <p className="text-gray-300">Empowering Legal Professionals</p>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Shashwat Bali</h4>
              <p className="text-gray-300 leading-relaxed">
                Combining deep legal knowledge with cutting-edge digital strategies to help 
                legal professionals communicate effectively and build lasting relationships 
                with their audiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderHighlight;