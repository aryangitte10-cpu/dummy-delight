'use client'

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Award, ArrowRight, Sparkles, Leaf, Globe, TrendingUp, CheckCircle2 } from "lucide-react"
import { CountUp } from "@/components/count-up"
import { useStatistics } from "@/hooks/useStatistics"
import { PageLoader } from "@/components/page-loader"

const features = [
  {
    icon: Calendar,
    title: "Discover Events",
    description: "Browse curated sustainability events that match your interests and schedule.",
    stat: "activeEvents",
    statLabel: "Active Events"
  },
  {
    icon: Users,
    title: "Expert Organizers",
    description: "Connect with experienced professionals leading the sustainability movement.",
    stat: "totalCoaches",
    statLabel: "Expert Organizers"
  },
  {
    icon: Award,
    title: "Track Progress",
    description: "Monitor your journey and celebrate achievements along the way.",
    stat: "totalRegistrations",
    statLabel: "Total Bookings"
  }
]

const benefits = [
  "Access to exclusive sustainability events",
  "Connect with like-minded individuals",
  "Learn from industry experts",
  "Track your environmental impact",
  "Join a growing community",
  "Make real change happen"
]

export default function Home() {
  const { activeEvents, totalCoaches, totalRegistrations, loading } = useStatistics()
  const [showLoader, setShowLoader] = useState(true)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const stats = { activeEvents, totalCoaches, totalRegistrations }

  if (showLoader) {
    return <PageLoader onComplete={() => setShowLoader(false)} />
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <motion.div
            className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px]"
            animate={{
              x: [0, -40, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          className="container max-w-5xl mx-auto px-4 text-center relative z-10"
          style={{ opacity, scale }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span>Your sustainability journey starts here</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-foreground">Make an </span>
            <span className="gradient-text-animated">Impact</span>
            <br />
            <span className="text-foreground">That Matters</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Connect with sustainability experts, discover transformative events, 
            and join a community dedicated to creating a better world.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/events">
              <Button size="xl" className="group shadow-xl shadow-primary/25">
                Explore Events
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/coaches">
              <Button size="xl" variant="outline" className="group">
                Find Organizers
                <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {[
              { value: activeEvents, label: "Active Events" },
              { value: totalCoaches, label: "Expert Organizers" },
              { value: totalRegistrations, label: "Bookings Made" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-1">
                  {loading ? (
                    <span className="animate-pulse">—</span>
                  ) : (
                    <CountUp end={stat.value} suffix="+" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="gradient-text">Impact Board</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to discover, connect, and make a difference
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full group card-glow border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-card to-secondary/30">
                  <CardHeader className="pb-4">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 6 }}
                    >
                      <feature.icon className="h-7 w-7 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-4 border-t border-border/50">
                      <div className="text-4xl font-display font-bold gradient-text mb-1">
                        {loading ? (
                          <span className="animate-pulse">—</span>
                        ) : (
                          <CountUp end={stats[feature.stat as keyof typeof stats]} suffix="+" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.statLabel}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Benefits
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Join a Growing
                <br />
                <span className="gradient-text">Sustainable Community</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Be part of a movement that&apos;s making real change. Connect with thousands of 
                like-minded individuals committed to creating a sustainable future.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Decorative rings */}
                <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-8 border-2 border-dashed border-accent/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute inset-16 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                
                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Leaf className="h-16 w-16 text-primary-foreground" />
                  </motion.div>
                </div>

                {/* Floating icons */}
                {[
                  { icon: Globe, position: "top-0 left-1/2 -translate-x-1/2 -translate-y-4" },
                  { icon: TrendingUp, position: "top-1/2 right-0 translate-x-4 -translate-y-1/2" },
                  { icon: Users, position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-4" },
                  { icon: Calendar, position: "top-1/2 left-0 -translate-x-4 -translate-y-1/2" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${item.position}`}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-card border shadow-lg flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, hsl(var(--accent) / 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Ready to Make a <span className="gradient-text">Difference</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of changemakers who are transforming their lives 
              and the planet through meaningful events and connections.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/signup">
                <Button size="xl" className="group shadow-2xl shadow-primary/30">
                  Start Your Journey
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <p className="text-sm text-muted-foreground mt-6">
              Free to join • No credit card required
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
