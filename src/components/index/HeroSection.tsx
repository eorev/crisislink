
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Simulate loading delay for animations
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  });

  return (
    <section className="relative bg-gradient-to-b from-white to-sky-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-crisisBlue-100 text-crisisBlue-800">
              Smart Disaster Management
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Optimizing Disaster Relief with <span className="text-crisisBlue-600">AI</span> and <span className="text-crisisGold-500">Data</span>
            </h1>
            <p className="text-lg text-gray-600 md:pr-10 tracking-wide">
              CrisisLink monitors disaster relief shelters in real-time, tracking resources and using AI to optimize distribution and predict natural disasters.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <Button asChild size="lg" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
                  <Link to="/dashboard">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className={`relative ${isLoaded ? 'animate-fade-in animation-delay-200' : 'opacity-0'}`}>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Dashboard interface showing disaster management data"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-crisisBlue-200 transform rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
