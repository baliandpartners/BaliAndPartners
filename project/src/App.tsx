import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import HowWeWork from './components/HowWeWork';
import FounderHighlight from './components/FounderHighlight';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <HowWeWork />
      <FounderHighlight />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;