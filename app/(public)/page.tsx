'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Sparkles,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { eventService, highlightService } from '@/lib/database';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch events from API route with timeout
      const eventsPromise = fetch('/api/events', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000) // 8 second timeout
      })
        .then(r => r.ok ? r.json() : { upcoming: [], past: [], all: [] })
        .catch(() => ({ upcoming: [], past: [], all: [] }));

      // Fetch highlights with timeout
      const highlightsPromise = fetch('/api/highlights', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000)
      })
        .then(r => r.ok ? r.json() : { highlights: [] })
        .catch(() => ({ highlights: [] }));

      const [eventsRes, highlightsRes] = await Promise.all([
        eventsPromise,
        highlightsPromise
      ]);

      // Set events data
      const upcoming = eventsRes.upcoming || [];
      setUpcomingEvents(upcoming.slice(0, 3));

      // Set highlights data
      const highlights = highlightsRes.highlights || [];
      setHighlights(highlights.slice(0, 3));

      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(null); // Don't block UI with errors
      setUpcomingEvents([]);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us in our exciting journey of learning and innovation"
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="animate-pulse"
                >
                  <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-lg">
                    <div className="h-48 bg-gradient-to-br from-primary-200 via-secondary-200 to-primary-300 dark:from-primary-900/50 dark:via-secondary-900/50 dark:to-primary-800/50 animate-gradient-xy" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.1s' }} />
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.$id} event={event} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No upcoming events at the moment.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Check back soon for exciting workshops and events!
              </p>
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="primary" size="lg">
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Latest Highlights"
            subtitle="Stay updated with our recent activities and achievements"
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : highlights.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {highlights.map((highlight, index) => (
                <HighlightCard
                  key={highlight.$id}
                  highlight={highlight}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No highlights available yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                We&apos;ll share exciting updates soon!
              </p>
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link href="/highlights">
              <Button variant="outline" size="lg">
                Read More Highlights
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logos */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-3 shadow-xl border border-gray-200 flex items-center justify-center">
              <Image
                src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/aiml-logo/view?project=691e2b31003e6415bb4f"
                alt="AIML Club Logo"
                fill
                className="object-contain animate-float p-2"
                style={{ background: 'white' }}
              />
            </div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-3 shadow-xl border border-gray-200 flex items-center justify-center">
              <Image
                src="https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/college-logo/view?project=691e2b31003e6415bb4f"
                alt="OCT Logo"
                fill
                className="object-contain animate-float rounded-xl"
                style={{ animationDelay: '0.5s', background: 'white' }}
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">AI & Machine Learning Club</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Oriental College of Technology, Bhopal
          </p>

          <p className="text-2xl md:text-3xl font-display italic text-gray-600">
            <span className="text-primary-500">Innovate</span> •{' '}
            <span className="text-secondary-500">Implement</span> •{' '}
            <span className="text-accent-neon">Inspire</span>
          </p>

          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Join us in exploring the fascinating world of Artificial Intelligence
            and Machine Learning. Learn, build, and innovate together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/join">
              <Button variant="primary" size="lg" className="glow-effect">
                <Sparkles className="w-5 h-5 mr-2" />
                Join the Club
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg">
                Explore Events
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// About Section Component
function AboutSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              About <span className="gradient-text">AIML Club</span>
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                The AI & Machine Learning Club at Oriental College of Technology is
                a student-driven community dedicated to exploring and advancing the
                fields of Artificial Intelligence and Machine Learning.
              </p>
              <p>
                We organize workshops, seminars, hackathons, and hands-on projects
                to help students develop practical skills and stay updated with the
                latest trends in AI/ML technology.
              </p>
              <p>
                Our mission is to create a collaborative environment where students
                can learn, experiment, and innovate together, preparing them for
                the future of technology.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative h-96 rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://fra.cloud.appwrite.io/v1/storage/buckets/gallery/files/691e543617b671a23779/view?project=691e2b31003e6415bb4f&mode=admin"
              alt="AIML Club Team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
        >
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Community"
            description="Join 200+ passionate members"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Events"
            description="Regular workshops & seminars"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Competitions"
            description="Hackathons & challenges"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Innovation"
            description="Real-world AI/ML projects"
          />
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section Component
function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [counts, setCounts] = useState({ members: 0, events: 0, projects: 0 });

  useEffect(() => {
    if (inView) {
      const timer = setInterval(() => {
        setCounts((prev) => ({
          members: Math.min(prev.members + 5, 200),
          events: Math.min(prev.events + 1, 25),
          projects: Math.min(prev.projects + 1, 15),
        }));
      }, 30);

      return () => clearInterval(timer);
    }
  }, [inView]);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <StatCard number={counts.members} label="Active Members" suffix="+" />
          <StatCard number={counts.events} label="Events Conducted" suffix="+" />
          <StatCard number={counts.projects} label="Projects Completed" suffix="+" />
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
          Ready to Start Your AI Journey?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Join our community and be part of the future of technology
        </p>
        <Link href="/join">
          <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
            <Sparkles className="w-5 h-5 mr-2" />
            Join AIML Club Today
          </Button>
        </Link>
      </div>
    </section>
  );
}

// Helper Components
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <Card hover className="p-6 text-center">
      <div className="text-primary-600 dark:text-primary-400 mb-3 flex justify-center">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Card>
  );
}

function StatCard({ number, label, suffix = '' }: any) {
  return (
    <div>
      <div className="text-5xl md:text-6xl font-display font-bold mb-2">
        {number}{suffix}
      </div>
      <div className="text-xl text-primary-100">{label}</div>
    </div>
  );
}

function EventCard({ event, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/events/${event.slug}`}>
        <Card hover className="h-full">
          {event.posterUrl && (
            <div className="relative h-48 rounded-t-xl overflow-hidden">
              <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full capitalize">
                {event.type.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(event.startDate)}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {event.description}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function HighlightCard({ highlight, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/highlights/${highlight.slug}`}>
        <Card hover className="h-full">
          <div className="p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {formatDate(highlight.date)} • {highlight.author}
            </div>
            <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {highlight.excerpt}
            </p>
            <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium">
              Read More <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
