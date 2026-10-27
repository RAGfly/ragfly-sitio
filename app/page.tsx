import { HeroBg } from '../components/sections/HeroBg'
import { Header } from '../components/sections/Header'
import { Hero } from '../components/sections/Hero'
import { ComoFuncionaSection } from '../components/sections/ComoFuncionaSection'
import { NegativaSection } from '../components/sections/NegativaSection'
import { SimpleSection } from '../components/sections/SimpleSection'
import { PrivadoSection } from '../components/sections/PrivadoSection'
import { PrecisoSection } from '../components/sections/PrecisoSection'
import { ConfigContextoSection } from '../components/sections/ConfigContextoSection'
import { PerfilesSection } from '../components/sections/PerfilesSection'
import { SurfacesSection } from '../components/sections/SurfacesSection'
import { PricingSection } from '../components/sections/PricingSection'
import { CierreSection } from '../components/sections/CierreSection'
import { Footer } from '../components/sections/Footer'

export default function Home() {
  return (
    <main className="flex flex-col min-h-full">
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <HeroBg />
        <Header />
        <Hero />
      </div>
      <ComoFuncionaSection />
      <NegativaSection />
      <SimpleSection />
      <PrivadoSection />
      <PrecisoSection />
      <PerfilesSection />
      <ConfigContextoSection />
      <SurfacesSection />
      <PricingSection />
      <CierreSection />
      <Footer />
    </main>
  )
}
