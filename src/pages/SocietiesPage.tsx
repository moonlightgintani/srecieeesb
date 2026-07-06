import Navbar from "@/components/Navbar";
import SocietiesSection from "@/components/SocietiesSection";
import Footer from "@/components/Footer";

const SocietiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SocietiesSection />
      <Footer />
    </div>
  );
};

export default SocietiesPage;
