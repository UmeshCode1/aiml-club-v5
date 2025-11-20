'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import Skeleton from '@/components/ui/Skeleton';

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
    Leadership: filteredTeam.filter((m) => m.category === 'leadership' || m.category === 'faculty'),
    'Technical Team': filteredTeam.filter((m) => m.category === 'tech'),
    'Event Management': filteredTeam.filter((m) => m.category === 'event_heads'),
    'Media & PR': filteredTeam.filter((m) => m.category === 'media'),
    'Creative Team': filteredTeam.filter((m) => m.category === 'editors'),
    Operations: filteredTeam.filter((m) => m.category === 'discipline' || m.category === 'stage'),
  } as Record<string, TeamMember[]>;

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroBanner />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroBanner />

        {/* Search / Filter */}
        <div className="mt-10 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-card/70 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Team Sections */}
        {Object.entries(groupedTeam).map(([category, members]) =>
          members.length > 0 ? (
            <section key={category} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((member, index) => (
                  <TeamMemberCard key={member.$id} member={member} index={index} />
                ))}
              </div>
            </section>
          ) : null
        )}

        {filteredTeam.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">No team members match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HeroBanner() {
  return (
    <div className="relative h-[340px] w-full rounded-3xl overflow-hidden shadow-xl shadow-primary-500/10 ring-1 ring-gray-200 dark:ring-gray-800">
      <Image
        src={
          '/images/club-banner.webp'
        }
        alt="AI & Machine Learning Club Banner"
        fill
        priority
        className="object-cover"
        onError={(e: any) => {
          // fallback to logo if banner missing
          e.target.src = '/images/logo aiml.png';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-primary-900/70 mix-blend-multiply" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-primary-300 via-white to-secondary-300 bg-clip-text text-transparent drop-shadow"
        >
          AI & Machine Learning Club
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200/90"
        >
          Innovate • Implement • Inspire — Driven by a multidisciplinary team.
        </motion.p>
      </div>
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card hover className="h-full overflow-hidden group">
        {/* Photo */}
        <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900">
          {member.photoId ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_TEAM}/files/${member.photoId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-600 transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {member.role}
          </p>

          {/* Social Links */}
          {(member.instagram || member.linkedin || member.github || member.email) && (
            <div className="flex items-center gap-2">
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
