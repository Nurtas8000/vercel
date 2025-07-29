import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { Footer } from "@/components/footer"
import { UserTypeSelector } from "@/components/user-type-selector"
import { FloatingActionButtons } from "@/components/floating-action-buttons"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <UserTypeSelector />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
      <FloatingActionButtons />
    </div>
  )
}
