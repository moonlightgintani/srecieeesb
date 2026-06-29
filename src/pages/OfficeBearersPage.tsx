import Navbar from "@/components/Navbar";
import OfficeBearersSection from "@/components/OfficeBearersSection";
import Footer from "@/components/Footer";

const OfficeBearersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <OfficeBearersSection />
      </div>
      <Footer />
    </div>
  );
};

export default OfficeBearersPage;
