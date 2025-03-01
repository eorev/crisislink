
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/index/HeroSection';
import FeaturesSection from '@/components/index/FeaturesSection';
import StatsSection from '@/components/index/StatsSection';
import CTASection from '@/components/index/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
