import React from 'react';
import { MessageSquare, PenTool, Rocket, BarChart3 } from 'lucide-react';

const HowWeWork = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Discovery',
      description: 'We understand your goals and audience'
    },
    {
      icon: PenTool,
      title: 'Strategy',
      description: 'We craft a tailored content strategy'
    },
    {
      icon: Rocket,
      title: 'Creation',
      description: 'We produce high-quality content'
    },
    {
      icon: BarChart3,
      title: 'Optimize',
      description: 'We measure and refine for results'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">How We Work</h3>
          <p className="text-gray-600">Our proven 4-step process ensures exceptional results</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
                            group-hover:bg-blue-100 transition-colors duration-300">
                <step.icon className="text-blue-600" size={24} />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;