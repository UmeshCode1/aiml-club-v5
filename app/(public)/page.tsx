'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Users, Code, Brain, ChevronRight } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logos */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/logo-aiml.png"
                    alt="AIML Club Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <div className="relative w-full h-full">
                  <Image
                    src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/college-logo/view?project=691e2b31003e6415bb4f&mode=admin"
                    alt="OCT Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                AI
              </span>{' '}
              <span className="text-white">&</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Machine Learning
              </span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                Club
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8">
              Oriental College of Technology, Bhopal
            </p>

            <div className="text-2xl md:text-3xl font-light italic mb-8">
              <span className="text-blue-400">Innovate</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-purple-400">Implement</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-cyan-400">Inspire</span>
            </div>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join us in exploring the fascinating world of Artificial Intelligence and Machine Learning. Learn, build, and innovate together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
              <Link href="/events" className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm">
                Explore Events
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
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      <AnimatedBackground />
      <AboutSection />

      {/* Features Grid */}
      <section className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-purple-400" />}
              title="Learn AI/ML"
              description="Master the fundamentals of Artificial Intelligence and Machine Learning through hands-on workshops."
              delay={0.1}
            />
            <FeatureCard
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Build Projects"
              description="Collaborate on real-world projects and build a strong portfolio for your future career."
              delay={0.2}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-pink-400" />}
              title="Community"
              description="Connect with like-minded peers, mentors, and industry experts in our vibrant community."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="500+" label="Members" delay={0} />
            <StatItem number="50+" label="Events" delay={0.1} />
            <StatItem number="20+" label="Projects" delay={0.2} />
            <StatItem number="10+" label="Partners" delay={0.3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 p-12 text-center">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Whether you&apos;re a beginner or an expert, there&apos;s a place for you in our club.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                Join the Club <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
    >
      <div className="mb-6 p-4 bg-white/5 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatItem({ number, label, delay }: { number: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
        {number}
      </div>
      <div className="text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
}
