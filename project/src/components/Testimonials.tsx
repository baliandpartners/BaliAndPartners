import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      position: 'Partner, Mitchell & Associates',
      content: 'Bali & Partners transformed our content strategy. Our LinkedIn engagement increased by 300% within three months.',
      rating: 5
    },
    {
      name: 'Rakesh Kumar',
      position: 'Managing Partner, Rakesh Legal',
      content: 'Their ghostwriting services captured my voice perfectly. The content quality is exceptional and drives real results.',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      position: 'Senior Attorney, Chen Law Firm',
      content: 'The SEO strategy they developed for our practice has significantly improved our online visibility and client acquisition.',
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-800 mb-6">What Our Clients Say</h3>
          <p className="text-gray-600">Real feedback from legal professionals we've helped succeed</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="text-amber-400 fill-current" size={20} />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>
              
              <div>
                <p className="font-semibold text-slate-800">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentIndex].position}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 
                     shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-blue-50"
          >
            <ChevronLeft className="text-gray-600" size={24} />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 
                     shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-blue-50"
          >
            <ChevronRight className="text-gray-600" size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;