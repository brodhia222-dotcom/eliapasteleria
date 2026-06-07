import Hero from "@/components/home/Hero";
import SpecialDateBanner from "@/components/home/SpecialDateBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import HomeCTA from "@/components/home/HomeCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecialDateBanner />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
      <HomeCTA />
    </>
  );
}
