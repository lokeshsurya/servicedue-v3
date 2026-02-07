import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SEOHead } from '../components/SEOHead'
import { FeatureCard } from '../components/FeatureCard'
import { FeatureList } from '../components/FeatureList'
import { WhatsAppBadge } from '../components/WhatsAppBadge'
import { PhoneMockup } from '../components/PhoneMockup'
import { SegmentTabs } from '../components/SegmentTabs'
import { SegmentTabContent } from '../components/SegmentTabContent'
import { AutopilotCard } from '../components/AutopilotCard'
import { StatsRow } from '../components/StatsRow'
import { RevenueFeatureCard } from '../components/RevenueFeatureCard'
import { SocialProof } from '../components/SocialProof'
import { FinalCTA } from '../components/FinalCTA'
import { heroContent } from '../content/hero'
import { segmentationContent } from '../content/segmentation'
import { autopilotContent } from '../content/autopilot'
import { revenueContent } from '../content/revenue'
import { socialProofContent, finalCTAContent } from '../content/footer'
import {
  ANIMATION_DURATION,
  ANIMATION_DELAY
} from '../constants/animations'

function Landing() {
  const [activeTab, setActiveTab] = useState('warranty')
  const activeTabData = segmentationContent.tabs.find(tab => tab.id === activeTab)!

  return (
    <>
      <SEOHead
        title="ServiceDue | WhatsApp Service Reminders for Dealerships"
        description="The #1 Service CRM for Two-Wheeler Dealerships. Automate service due calls with WhatsApp. Compatible with Hero, Suzuki, Honda DMS."
      />
      <Header />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16">
          <div className="max-w-container mx-auto">

            {/* Top: Centered Text & Button */}
            <div className="text-center mb-16 lg:mb-20">
              {/* Headline */}
              <motion.h1
                className="text-5xl lg:text-6xl font-black text-primary-black leading-tight tracking-tighter mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.NORMAL, delay: ANIMATION_DELAY.SHORT }}
              >
                {heroContent.headline}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                className="text-lg text-text-body leading-relaxed mb-8 mx-auto max-w-[700px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.NORMAL, delay: ANIMATION_DELAY.MEDIUM }}
              >
                {heroContent.subheadline}
              </motion.p>

              {/* CTA Button */}
              <motion.a
                href="/signup"
                className="inline-block bg-primary-blue text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wider shadow-button hover:shadow-button-hover transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.NORMAL, delay: ANIMATION_DELAY.LONG }}
                aria-label={heroContent.cta.ariaLabel}
              >
                {heroContent.cta.primary}
              </motion.a>
            </div>

            {/* Bottom: Features (Left) + Phone (Right) - 12 Column Grid */}
            <div id="features" className="grid lg:grid-cols-12 gap-8 items-start scroll-mt-24">

              {/* Left: Feature Card (Spans 5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                <FeatureCard
                  title={heroContent.featureCard.title}
                  badge={heroContent.featureCard.badge}
                  description={heroContent.featureCard.description}
                  link={heroContent.featureCard.link}
                />

                <FeatureList features={heroContent.features} />

                <WhatsAppBadge text={heroContent.whatsappBadge} />
              </div>

              {/* Right: Phone Mockup (Spans 7 cols with offset) */}
              <motion.div
                className="lg:col-span-7 lg:col-start-7 relative flex items-center justify-center lg:justify-end pt-8 lg:pt-0 overflow-visible"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.NORMAL, delay: ANIMATION_DELAY.VERY_LONG }}
              >
                <PhoneMockup
                  contact={heroContent.phoneConversation.contact}
                  messages={heroContent.phoneConversation.messages}
                />
              </motion.div>

            </div>
          </div>
        </section>

        {/* Segmentation Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-bg-light-gray">
          <div className="max-w-container mx-auto">
            {/* Section Headline */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-primary-black leading-tight tracking-tighter mb-4">
                {segmentationContent.headline}
              </h2>
              <p className="text-lg text-text-body max-w-2xl mx-auto">
                {segmentationContent.subheadline}
              </p>
            </div>

            {/* Tabs */}
            <SegmentTabs
              tabs={segmentationContent.tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <SegmentTabContent tab={activeTabData} />
          </div>
        </section>

        {/* WhatsApp Autopilot Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16">
          <div className="max-w-container mx-auto">
            <AutopilotCard
              badge={autopilotContent.badge}
              headline={autopilotContent.headline}
              description={autopilotContent.description}
              highlights={autopilotContent.highlights}
              cta={autopilotContent.cta}
            />
          </div>
        </section>

        {/* Revenue Command Center Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-bg-light-gray">
          <div className="max-w-container mx-auto">

            {/* Stats Row */}
            <StatsRow stats={revenueContent.stats} />

            {/* Section Headline */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-primary-black leading-tight tracking-tighter mb-4">
                {revenueContent.headline}
              </h2>
              <p className="text-lg text-text-body max-w-3xl mx-auto">
                {revenueContent.subheadline}
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {revenueContent.cards.map((card) => (
                <RevenueFeatureCard
                  key={card.id}
                  badge={card.badge}
                  headline={card.headline}
                  description={card.description}
                  bgColor={card.bgColor}
                  icon={card.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16">
          <div className="max-w-container mx-auto">
            <SocialProof
              headline={socialProofContent.headline}
              dealerBrands={socialProofContent.dealerBrands}
              stats={socialProofContent.stats}
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="py-20 md:py-28 px-6 md:px-12 lg:px-16 bg-gradient-to-br from-primary-blue/5 to-badge-purple/5">
          <div className="max-w-container mx-auto">
            <FinalCTA
              headline={finalCTAContent.headline}
              subheadline={finalCTAContent.subheadline}
              cta={finalCTAContent.cta}
            />
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default Landing
