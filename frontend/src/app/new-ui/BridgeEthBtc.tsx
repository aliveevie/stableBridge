import { BridgeHero } from "./_components/bridge-hero"
import { BenefitsSection } from "./_components/benefits-section"
import { CallToAction } from "./_components/call-to-action"

export function BridgeEthToBtc() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <BridgeHero />
      <BenefitsSection />
      <CallToAction />
    </main>
  )
}
