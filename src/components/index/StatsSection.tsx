
import { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

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

const StatsSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate loading delay for animations
  useState(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  });

  return (
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
  );
};

export default StatsSection;
