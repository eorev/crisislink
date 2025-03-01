
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  
  return (
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
            {isAuthenticated ? (
              <Button asChild size="lg" variant="secondary" className="bg-white text-crisisBlue-600 hover:bg-gray-100">
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary" className="bg-white text-crisisBlue-600 hover:bg-gray-100">
                <Link to="/register">Get Started Free</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
