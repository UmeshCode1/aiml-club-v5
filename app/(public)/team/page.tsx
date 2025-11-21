'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail, Search, Users, Award, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { CardSkeleton } from '@/components/ui/Skeleton';

interface TeamMember {
  $id: string;
  name: string;
  role: string;
  category: string;
  bio?: string;
  photoId?: string;
  email?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  order: number;
  imageUrl?: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setError(null);
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.error) setError(data.error);
      setTeam((data.members || []).sort((a: TeamMember, b: TeamMember) => a.order - b.order));
    } catch (error: any) {
      setError(error.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = useMemo(() => {
    if (!query.trim()) return team;
    const q = query.toLowerCase();
    return team.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q)
    );
  }, [team, query]);

  const groupedTeam = {
    Faculty: filteredTeam.filter((m) => m.category === 'faculty'),
    Leadership: filteredTeam.filter((m) => m.category === 'leadership'),
    Finance: filteredTeam.filter((m) => m.category === 'finance'),
    'Technical Team': filteredTeam.filter((m) => m.category === 'tech'),
    'Event Management': filteredTeam.filter((m) => m.category === 'event_heads'),
    'Stage Management': filteredTeam.filter((m) => m.category === 'stage'),
    Media: filteredTeam.filter((m) => m.category === 'media'),
    'Creative Team': filteredTeam.filter((m) => m.category === 'editors'),
    'Public Relations': filteredTeam.filter((m) => m.category === 'pr'),
    Discipline: filteredTeam.filter((m) => m.category === 'discipline'),
  } as Record<string, TeamMember[]>;

  const stats = [
    { icon: Users, label: 'Team Members', value: team.length },
    { icon: Award, label: 'Categories', value: Object.values(groupedTeam).filter(g => g.length > 0).length },
    { icon: Sparkles, label: 'Excellence', value: '100%' },
  ];

  if (loading) {
    return (
      <div className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <HeroBanner />
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <HeroBanner />

        {/* Stats Section - Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg flex-shrink-0">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Search - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-10 lg:mt-12 mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl sm:rounded-2xl blur-xl" />
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary-500 dark:text-primary-400" />
              <input
                type="text"
                placeholder="Search by name, role or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 text-base sm:text-lg"
              />
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-3 sm:mt-4 text-xs sm:text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Team Sections - Responsive Grid */}
        <AnimatePresence mode="wait">
          {Object.entries(groupedTeam).map(([category, members]) =>
            members.length > 0 ? (
              <motion.section
                key={category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-12 sm:mb-16 lg:mb-20"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10"
                >
                  <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {category}
                  </h2>
                  <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-secondary-500/50 to-transparent rounded-full" />
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {members.map((member, index) => (
                    <TeamMemberCard key={member.$id} member={member} index={index} />
                  ))}
                </div>
              </motion.section>
            ) : null
          )}
        </AnimatePresence>

        {filteredTeam.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 lg:py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">No Results Found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">Try adjusting your search to find what you&apos;re looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function HeroBanner() {
  return (
    <div className="relative h-[280px] sm:h-[340px] lg:h-[400px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-800/50">
      <Image
        src={'https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/clubteamimage/view?project=691e2b31003e6415bb4f'}
        alt="AI & Machine Learning Club Banner"
        fill
        priority
        className="object-cover"
        onError={(e: any) => {
          e.target.src = 'https://fra.cloud.appwrite.io/v1/storage/buckets/691f19dd000afea07882/files/aimllogo/view?project=691e2b31003e6415bb4f';
        }}
      />
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-primary-900/80" />

      {/* Animated particles effect - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary-300 via-white to-secondary-300 bg-clip-text text-transparent drop-shadow-2xl">
              AI & Machine Learning Club
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-medium leading-relaxed"
          >
            Innovate • Implement • Inspire
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-base lg:text-lg text-white/80"
          >
            Driven by a multidisciplinary team of passionate innovators
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="h-full group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-secondary-500/0 to-primary-500/0 group-hover:from-primary-500/20 group-hover:via-secondary-500/20 group-hover:to-primary-500/20 rounded-xl sm:rounded-2xl blur-xl transition-all duration-500 -z-10" />

      <Card hover className="h-full overflow-hidden group relative border-2 border-transparent hover:border-primary-500/20 dark:hover:border-primary-400/20 transition-all duration-300">
        {/* Photo with enhanced styling - Responsive height */}
        <div className="relative h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-primary-100 via-secondary-50 to-primary-50 dark:from-primary-900/30 dark:via-secondary-900/20 dark:to-primary-900/30 overflow-hidden">
          {member.imageUrl ? (
            <>
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Name overlay on hover - Hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">{member.name}</h3>
                <p className="text-sm sm:text-base text-white/90 font-medium">{member.role}</p>
              </motion.div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 flex items-center justify-center text-white text-3xl sm:text-4xl lg:text-5xl font-bold shadow-2xl ring-4 ring-white/30 group-hover:scale-110 transition-transform duration-300">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            </div>
          )}

          {/* Category badge with enhanced styling */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 shadow-xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
            {member.category}
          </div>
        </div>

        {/* Info section with enhanced spacing - Responsive padding */}
        <div className="p-4 sm:p-5 lg:p-7 bg-white dark:bg-dark-card">
          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
            {member.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 lg:mb-6 font-semibold line-clamp-2">
            {member.role}
          </p>

          {/* Enhanced Social Links - Responsive sizing */}
          {(member.instagram || member.linkedin || member.github || member.email) && (
            <div className="flex items-center gap-2 sm:gap-2.5 pt-3 sm:pt-4 lg:pt-5 border-t-2 border-gray-100 dark:border-gray-800">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 text-blue-600 dark:text-blue-400 transition-all duration-200 hover:scale-110 sm:hover:scale-125 hover:-rotate-6 shadow-md hover:shadow-lg"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 text-blue-600 dark:text-blue-400 transition-all duration-200 hover:scale-110 sm:hover:scale-125 hover:-rotate-6 shadow-md hover:shadow-lg"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30 text-pink-600 dark:text-pink-400 transition-all duration-200 hover:scale-110 sm:hover:scale-125 hover:rotate-6 shadow-md hover:shadow-lg"
                  title="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/60 dark:hover:to-gray-600/60 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 sm:hover:scale-125 hover:-rotate-6 shadow-md hover:shadow-lg"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
