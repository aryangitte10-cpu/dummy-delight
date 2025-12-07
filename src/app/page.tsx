'use client'

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Award } from "lucide-react"
import { CountUp } from "@/components/count-up"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ParallaxHero } from "@/components/parallax-hero"
import { useStatistics } from "@/hooks/useStatistics"
import { FloatingOrbs } from "@/components/floating-orbs"
import { GradientText } from "@/components/gradient-text"
import { PageLoader } from "@/components/page-loader"
import { SplitText } from "@/components/split-text"
import { BlurReveal } from "@/components/blur-reveal"
import { MagneticButton } from "@/components/magnetic-button"
import { TiltCard } from "@/components/tilt-card"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  const { activeEvents, totalCoaches, totalRegistrations, loading } = useStatistics()
  const [showLoader, setShowLoader] = useState(true)

  if (showLoader) {
    return <PageLoader onComplete={() => setShowLoader(false)} />
  }

  return (
    <motion.div 
      className="flex flex-col min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatedBackground />
      
      {/* Hero Section */}
      <ParallaxHero>
        <section className="relative py-32 px-4 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
          <FloatingOrbs />
          <div className="container mx-auto text-center relative z-10">
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Welcome to Impact Board
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 text-foreground/80 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Connect with sustainability organizers, discover impactful events, and accelerate your journey towards a more sustainable future.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton>
                <Link href="/events">
                  <Button size="lg" className="gap-2 hover-lift glow-primary text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105">
                    <Calendar className="h-5 w-5" />
                    Explore Events
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/coaches">
                  <Button size="lg" variant="outline" className="gap-2 hover-lift text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:bg-primary/5 hover:border-primary/50">
                    <Users className="h-5 w-5" />
                    Find Organizers
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </section>
      </ParallaxHero>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <BlurReveal direction="none">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Why Choose Impact Board?</h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
              Discover the features that make us the perfect platform for your growth journey
            </p>
          </BlurReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurReveal delay={0.1} direction="up">
              <TiltCard className="h-full">
                <Card className="text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 group relative overflow-hidden bg-gradient-to-br from-card to-card/50 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 float">
                    <Calendar className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Discover Events</CardTitle>
                  <CardDescription className="text-base">
                    Browse and book seats for upcoming events
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground mb-6">
                    Find the perfect event that matches your interests and schedule
                  </p>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <CountUp end={activeEvents} suffix="+" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Active Events</p>
                </CardContent>
                </Card>
              </TiltCard>
            </BlurReveal>

            <BlurReveal delay={0.2} direction="up">
              <TiltCard className="h-full">
                <Card className="text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 group relative overflow-hidden bg-gradient-to-br from-card to-card/50 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 float">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Expert Organizers</CardTitle>
                  <CardDescription className="text-base">
                    Connect with experienced professionals
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground mb-6">
                    Learn from the best organizers in their respective fields
                  </p>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <CountUp end={totalCoaches} suffix="+" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Professional Organizers</p>
                </CardContent>
                </Card>
              </TiltCard>
            </BlurReveal>

            <BlurReveal delay={0.3} direction="up">
              <TiltCard className="h-full">
                <Card className="text-center hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 group relative overflow-hidden bg-gradient-to-br from-card to-card/50 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 float">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Track Progress</CardTitle>
                  <CardDescription className="text-base">
                    Monitor your bookings and growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground mb-6">
                    Keep track of all your events and achievements in one place
                  </p>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <CountUp end={totalRegistrations} suffix="+" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Total Bookings</p>
                </CardContent>
                </Card>
              </TiltCard>
            </BlurReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
        <FloatingOrbs />
        <div className="container mx-auto text-center relative z-10">
          <BlurReveal direction="up">
            <SplitText className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </SplitText>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of others who are transforming their lives through meaningful events and expert organizers
            </p>
            <MagneticButton strength={0.4}>
              <Link href="/signup">
                <Button size="lg" className="hover-lift glow-primary text-lg px-10 py-7 rounded-xl transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none shadow-xl">
                  Create Your Account
                </Button>
              </Link>
            </MagneticButton>
          </BlurReveal>
        </div>
      </section>
    </motion.div>
  )
}
