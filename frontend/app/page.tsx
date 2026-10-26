import Hero from "@/components/landing/Hero";
import PanchayatServices from "@/components/landing/PanchayatServices";
import Services from "@/components/landing/Services";

const page = () => {
  return (
    <div className="flex flex-col gap-8 bg-gray-200 p-6">
      <Hero />
      <Services />
      <PanchayatServices />
    </div>
  );
};

export default page;
