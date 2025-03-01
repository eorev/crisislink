
import { MapPin, TrendingUp, Users, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

const FeaturesSection = () => {
  return (
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
            <Card key={index} className={`p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all animate-slide-in`} style={{ animationDelay: `${200 + index * 100}ms` }}>
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
  );
};

export default FeaturesSection;
