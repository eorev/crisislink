
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/coastline.jpg'

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
        <div className="flex flex-col items-center">
          <div className={`space-y-6 text-center max-w-3xl mx-auto ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-crisisBlue-100 text-crisisBlue-800">
              AI-Powered Disaster Response
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-crisisBlue-600 to-crisisBlue-800">Revolutionize</span> Your
              <span className="hidden md:inline"> Disaster</span>
              <span className="md:hidden"> Disaster</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-crisisGold-500 to-crisisGold-600"> Response</span>
            </h1>
            <p className="text-lg text-gray-600 tracking-wide">
              CrisisLink monitors disaster relief shelters in real-time, tracking resources and using AI to optimize distribution and predict natural disasters.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
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

          <div className={`relative mt-16 max-w-4xl mx-auto ${isLoaded ? 'animate-fade-in animation-delay-200' : 'opacity-0'}`}>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
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
