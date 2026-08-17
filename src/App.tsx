import { Header } from "@/components/Header";
import { KineticRibbons } from "@/components/KineticRibbons";
import { Hero, ProblemManifesto, TraceBand, TwoSides } from "@/components/sections/Opening";
import { ActivationGrid, ActivationRitual, PassBox, PassVariants, PhysicalPass } from "@/components/sections/Product";
import { SystemViews } from "@/components/sections/System";
import {
  CategoryRoadmap,
  ComparisonTable,
  PrivacyTable,
  ProviderSegments,
} from "@/components/sections/Tables";
import {
  FounderSection,
  MissionPrinciples,
  OfferArchitecture,
  PrelaunchTransparency,
} from "@/components/sections/Closing";
import { FAQ, Footer, PilotForm } from "@/components/sections/Conversion";

export default function App() {
  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-saffron focus:px-4 focus:py-2 focus:text-plum"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <TraceBand />
        <ProblemManifesto />
        <TwoSides />
        <PhysicalPass />
        <PassVariants />
        <ActivationRitual />
        <PassBox />
        <ActivationGrid />
        <KineticRibbons />
        <SystemViews />
        <PrivacyTable />
        <CategoryRoadmap />
        <ComparisonTable />
        <ProviderSegments />
        <OfferArchitecture />
        <MissionPrinciples />
        <FounderSection />
        <PrelaunchTransparency />
        <FAQ />
        <PilotForm />
      </main>
      <Footer />
    </>
  );
}
