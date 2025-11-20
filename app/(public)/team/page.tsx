'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail } from 'lucide-react';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';

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

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeam(data.members || []);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedTeam = {
    Leadership: team.filter((m) => m.category === 'leadership'),
    'Technical Team': team.filter((m) => m.category === 'tech'),
    'Event Management': team.filter((m) => m.category === 'event_heads'),
    'Media & PR': team.filter((m) => m.category === 'media'),
    'Creative Team': team.filter((m) => m.category === 'editors'),
    'Operations': team.filter((m) => m.category === 'discipline' || m.category === 'stage'),
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Meet Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The passionate individuals driving innovation and excellence at AIML Club
          </p>
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

        {team.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">
              Team information will be updated soon.
            </p>
          </div>
        )}
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
