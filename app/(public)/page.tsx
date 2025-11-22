'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Brain, Code, Users, ChevronRight, Sparkles, Zap, Globe, Calendar } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Parallax Elements */}
        <motion.div style={{ y: y1, opacity }} className="absolute top-20 left-[10%] w-72 h-72 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none" />
        <motion.div style={{ y: y2, opacity }} className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container-width relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Logos with Glass Effect */}
            <div className="flex justify-center gap-8 mb-12">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="w-28 h-28 md:w-36 md:h-36 glass rounded-3xl p-6 flex items-center justify-center shadow-2xl shadow-primary-500/20"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/logo-aiml.png"
                    alt="AIML Club Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-28 h-28 md:w-36 md:h-36 glass rounded-3xl p-6 flex items-center justify-center shadow-2xl shadow-secondary-500/20"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/college-logo/view?project=691e2b31003e6415bb4f&mode=admin"
                    alt="OCT Logo"
                    fill
                    className="object-contain drop-shadow-md"
                  />
                </div>
              </motion.div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight">
              <span className="text-gradient-blue">AI</span>
              <span className="text-gray-400 dark:text-gray-500 mx-2 md:mx-4 font-light">&</span>
              <span className="text-gradient-purple">Machine Learning</span>
              <br />
              <span className="text-gray-900 dark:text-white relative inline-block mt-2">
                Club
                <motion.span
                  className="absolute -top-4 -right-8 md:-top-6 md:-right-12 text-3xl md:text-5xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🚀
                </motion.span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto">
              Oriental College of Technology, Bhopal
            </p>

            <div className="flex items-center justify-center gap-3 text-lg md:text-xl font-medium text-gray-300">
              <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Innovate</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Implement</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Inspire</span>
            </div>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join us in exploring the fascinating world of Artificial Intelligence and Machine Learning. Learn, build, and innovate together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link href="/contact">
                <Button size="lg" variant="primary" magnetic className="rounded-full px-10">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="secondary" magnetic className="rounded-full px-10">
                  Explore Events
                </Button>
              </Link>
            </div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center p-1 bg-white/5 backdrop-blur-sm">
              <div className="w-1 h-2 bg-primary-500 rounded-full animate-bounce" />
            </div>
          </div>
        </motion.div>
      </section>

      <AboutSection />

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="container-width">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why Join Us?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unlock your potential with resources, mentorship, and real-world projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-10 h-10 text-purple-400" />}
              title="Learn AI/ML"
              description="Master the fundamentals of Artificial Intelligence and Machine Learning through hands-on workshops and expert sessions."
              delay={0.1}
              gradient="from-purple-500/20 to-blue-500/20"
            />
            <FeatureCard
              icon={<Code className="w-10 h-10 text-blue-400" />}
              title="Build Projects"
              description="Collaborate on real-world projects, hackathons, and build a strong portfolio that stands out to recruiters."
              delay={0.2}
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-pink-400" />}
              title="Vibrant Community"
              description="Connect with like-minded peers, mentors, and industry experts. Grow your network and learn from the best."
              delay={0.3}
              gradient="from-pink-500/20 to-purple-500/20"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-sm" />
        <div className="container-width relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem number="500+" label="Active Members" icon={<Users className="w-6 h-6 mb-2 mx-auto text-primary-400" />} delay={0} />
            <StatItem number="50+" label="Events Hosted" icon={<Calendar className="w-6 h-6 mb-2 mx-auto text-secondary-400" />} delay={0.1} />
            <StatItem number="20+" label="Live Projects" icon={<Zap className="w-6 h-6 mb-2 mx-auto text-yellow-400" />} delay={0.2} />
            <StatItem number="10+" label="Industry Partners" icon={<Globe className="w-6 h-6 mb-2 mx-auto text-green-400" />} delay={0.3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container-width">
          <div className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-24 text-center group">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-secondary-900 animate-gradient" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-6">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Ready to shape the future?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Whether you&apos;re a beginner or an expert, there&apos;s a place for you in our club. Start your AI journey today.
                </p>
                <Link href="/contact">
                  <Button size="lg" variant="primary" magnetic className="rounded-full px-12 py-6 text-lg shadow-2xl shadow-primary-500/30">
                    Join the Club <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, gradient }: { icon: React.ReactNode; title: string; description: string; delay: number; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card tilt glass className="h-full p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 hover:to-white/5">
        <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${gradient} inline-block`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
      </Card>
    </motion.div>
  );
}

function StatItem({ number, label, icon, delay }: { number: string; label: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
    >
      {icon}
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
        {number}
      </div>
      <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">{label}</div>
    </motion.div>
  );
}
