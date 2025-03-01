
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  LifeBuoy, 
  AlertTriangle, 
  BarChart2, 
  ArrowRight, 
  MapPin, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const features = [
  {
    title: 'Real-time Shelter Monitoring',
    description: 'Track available space, food, water, and medical resources in shelters as the situation evolves.',
    icon: <MapPin className="h-6 w-6 text-crisisBlue-600" aria-hidden="true" />,
  },
  {
    title: 'Resource Optimization',
    description: 'AI-powered analysis to predict supply shortages and optimize resource distribution.',
    icon: <TrendingUp className="h-6 w-6 text-crisisBlue-600" aria-hidden="true" />,
  },
  {
    title: 'Volunteer Matching',
    description: 'Connect volunteers with shelters based on real-time needs and skill requirements.',
    icon: <Users className="h-6 w-6 text-crisisBlue-600" aria-hidden="true" />,
  },
  {
    title: 'Disaster Prediction',
    description: 'Utilize AI and historical data to predict natural disasters by analyzing patterns from past events.',
    icon: <BarChart2 className="h-6 w-6 text-crisisBlue-600" aria-hidden="true" />,
  },
];

const disasterTypes = [
  {
    name: 'Earthquakes',
    icon: <AlertTriangle className="h-8 w-8 text-crisisGold-500" aria-hidden="true" />,
    count: 127,
    change: '+12%',
  },
  {
    name: 'Floods',
    icon: <AlertTriangle className="h-8 w-8 text-crisisBlue-500" aria-hidden="true" />,
    count: 89,
    change: '+4%',
  },
  {
    name: 'Wildfires',
    icon: <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />,
    count: 72,
    change: '+18%',
  },
  {
    name: 'Hurricanes',
    icon: <AlertTriangle className="h-8 w-8 text-purple-500" aria-hidden="true" />,
    count: 43,
    change: '-2%',
  },
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate loading delay for animations
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  });

  return (
    <Layout>
      {/* Hero Section */}
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
                <Button asChild size="lg" className="bg-crisisBlue-600 hover:bg-crisisBlue-700">
                  <Link to="/dashboard">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Sign Up Free</Link>
                </Button>
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-crisisBlue-100 text-crisisBlue-800">
              Features
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
              Comprehensive Disaster Management
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CrisisLink provides a suite of tools to help manage disasters effectively and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all ${isLoaded ? 'animate-slide-in' : 'opacity-0'}`} style={{ animationDelay: `${200 + index * 100}ms` }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-crisisBlue-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-crisisGold-100 text-crisisGold-800">
              Impact
            </span>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
              Disaster Monitoring Statistics
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Current statistics on disaster incidents tracked by CrisisLink in the past year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {disasterTypes.map((item, index) => (
              <div key={index} className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: `${200 + index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  {item.icon}
                  <span className={`text-sm font-medium ${item.change.includes('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.change}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
                  {item.count}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
                  <span>Past 12 months</span>
                </p>
                <p className="mt-1 font-medium text-gray-800">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-crisisBlue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to optimize your disaster response efforts?
            </h2>
            <p className="mt-4 text-xl text-crisisBlue-100">
              Join CrisisLink today and leverage AI and data to improve disaster management.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-crisisBlue-600 hover:bg-gray-100">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-crisisBlue-700">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
