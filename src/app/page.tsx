import AboutServiceSection from "@/features/landing/components/AboutServiceSection";
import AdvantagesSection from "@/features/landing/components/AdvantagesSection";
import ContactSection from "@/features/landing/components/ContactSection";
import FaqSection from "@/features/landing/components/FaqSection";
import HeroSection from "@/features/landing/components/HeroSection";
import RequirementsSection from "@/features/landing/components/RequirementsSection";
import StatsSection from "@/features/landing/components/StatsSection";
import SubmissionFlowSection from "@/features/landing/components/SubmissionFlowSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection></StatsSection>
      <AboutServiceSection></AboutServiceSection>
      <RequirementsSection></RequirementsSection>
      <SubmissionFlowSection></SubmissionFlowSection>
      <AdvantagesSection></AdvantagesSection>
      <FaqSection></FaqSection>
      <ContactSection></ContactSection>
    </>
  );
}
