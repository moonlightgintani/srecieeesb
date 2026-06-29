import Navbar from "@/components/Navbar";
import SocietiesSection from "@/components/SocietiesSection";
import Footer from "@/components/Footer";

const SocietiesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <SocietiesSection />
      </div>
      <Footer />
    </div>
  );
};

export default SocietiesPage;
