import { HeroBg } from '../components/sections/HeroBg'
import { Header } from '../components/sections/Header'
import { Hero } from '../components/sections/Hero'
import { NegativaSection } from '../components/sections/NegativaSection'
import { SimpleSection } from '../components/sections/SimpleSection'
import { PrivadoSection } from '../components/sections/PrivadoSection'
import { PrecisoSection } from '../components/sections/PrecisoSection'
import { ConfigContextoSection } from '../components/sections/ConfigContextoSection'
import { PerfilesSection } from '../components/sections/PerfilesSection'
import { SurfacesSection } from '../components/sections/SurfacesSection'
import { LockInSection } from '../components/sections/LockInSection'
import { PricingSection } from '../components/sections/PricingSection'
import { CierreSection } from '../components/sections/CierreSection'
import { Footer } from '../components/sections/Footer'

/* ------------------------------------------------------------------ */
/* Page — ensamblador de la landing (REDISENO_SITIO_v2.md §2)          */
/*                                                                     */
/* S1 hero → S2 la negativa → S3 simple → S4 privado → S5 preciso →    */
/* S6 configuración → S7 perfiles → S8 superficies → S8.bis sin        */
/* lock-in → S9 planes → S10 cierre + FAQ.                             */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <main className="flex flex-col min-h-full">
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        <HeroBg />
        <Header />
        <Hero />
      </div>
      <NegativaSection />
      <SimpleSection />
      <PrivadoSection />
      <PrecisoSection />
      <ConfigContextoSection />
      <PerfilesSection />
      <SurfacesSection />
      <LockInSection />
      <PricingSection />
      <CierreSection />
      <Footer />
    </main>
  )
}
