import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HowItWorks } from '@/components/landing/how-it-works'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-sand to-white">
      <Header />
      <main>
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
