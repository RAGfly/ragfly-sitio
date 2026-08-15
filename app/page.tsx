import { HeroBg } from '../components/sections/HeroBg'
import { Header } from '../components/sections/Header'
import { Hero } from '../components/sections/Hero'
import { BuildingSection } from '../components/sections/BuildingSection'
import { ProblemSolutionSection } from '../components/sections/ProblemSolutionSection'
import { WhatIsSection } from '../components/sections/WhatIsSection'
import { CombinaSection } from '../components/sections/CombinaSection'
import { ChatSection } from '../components/sections/ChatSection'
import { IdentitiesSection } from '../components/sections/IdentitiesSection'
import { ModesSection } from '../components/sections/ModesSection'
import { SurfacesSection } from '../components/sections/SurfacesSection'
import { BuiltSection } from '../components/sections/BuiltSection'
import { SecuritySection } from '../components/sections/SecuritySection'
import { PricingSection } from '../components/sections/PricingSection'
import { WhyUsSection } from '../components/sections/WhyUsSection'
import { FinalCTASection } from '../components/sections/FinalCTASection'
import { Footer } from '../components/sections/Footer'

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <main className="flex flex-col min-h-full">
      <div className="h-screen flex flex-col relative overflow-hidden">
        <HeroBg />
        <Header />
        <Hero />
      </div>
      <BuildingSection />
      <ProblemSolutionSection />
      <WhatIsSection />
      <CombinaSection />
      <ChatSection />
      <IdentitiesSection />
      <ModesSection />
      <SurfacesSection />
      <BuiltSection />
      <SecuritySection />
      <PricingSection />
      <WhyUsSection />
      <FinalCTASection />
      <Footer />
    </main>
  )
}
