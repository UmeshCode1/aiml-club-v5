'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail, Search, Users, Award, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { teamService, TeamMember } from '@/lib/database';
import { getPreviewUrl, BUCKETS } from '@/lib/appwrite';

const CATEGORY_LABELS: Record<string, string> = {
  faculty: 'Faculty Coordinators',
  leadership: 'Leadership Team',
  finance: 'Finance Team',
  tech: 'Technical Team',
  event_heads: 'Event Management',
  stage: 'Stage Management',
  media: 'Media Team',
  editors: 'Creative Team',
  pr: 'Public Relations',
  discipline: 'Discipline Team',
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const response = await teamService.list();
      setTeam((response.documents as unknown as TeamMember[]).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeam = useMemo(() => {
    let filtered = team;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [team, query, selectedCategory]);

  const groupedTeam = useMemo(() => {
    const groups: Record<string, TeamMember[]> = {};
    Object.keys(CATEGORY_LABELS).forEach(cat => {
      const members = filteredTeam.filter(m => m.category === cat);
      if (members.length > 0) {
        groups[cat] = members;
      }
    });
    return groups;
  }, [filteredTeam]);

  const stats = [
    { icon: Users, label: 'Team Members', value: team.length },
    { icon: Award, label: 'Teams', value: Object.keys(groupedTeam).length },
    { icon: Sparkles, label: 'Dedication', value: '100%' },
  ];

  if (loading) return <Loader fullscreen />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-16 group"
        >
          <Image
            src="/images/team-group.jpg"
            alt="AIML Club Team"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg tracking-tight">
              <span className="text-blue-400">AI</span> & <span className="text-purple-400">Machine Learning</span> Club
            </h1>
            <p className="text-gray-200 text-lg md:text-2xl font-medium drop-shadow-md max-w-3xl">
              Innovate • Implement • Inspire — Driven by a multidisciplinary team.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="py-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search team members..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input md:w-64 w-full"
            >
              <option value="all">All Teams</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Team Grid */}
        {Object.keys(groupedTeam).length > 0 ? (
          Object.entries(groupedTeam).map(([category, members], groupIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + groupIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member, index) => (
                  <TeamMemberCard key={member.$id} member={member} index={index} />
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError || !member.photoId) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7c3aed&color=fff&size=400&bold=true&font-size=0.4`;
    }
    return getPreviewUrl(member.photoId, 400, 400, BUCKETS.TEAM);
  };

  const socialLinks = [
    { icon: Instagram, url: member.instagram, label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, url: member.linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Github, url: member.github, label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Mail, url: member.email ? `mailto:${member.email}` : null, label: 'Email', color: 'hover:text-green-400' },
  ].filter(link => link.url);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card hover className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-white/10">
        {/* Photo Section */}
        <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <Image
            src={getImageUrl()}
            alt={member.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90" />

          {/* Floating Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 rounded-full bg-purple-500/90 backdrop-blur-sm text-xs font-bold text-white shadow-lg">
              {member.category.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 flex flex-col p-6 text-center">
          {/* Name & Role */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
              {member.name}
            </h3>
            <p className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
              {member.role}
            </p>
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 px-2">
              {member.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-2">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-400/50 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 ${link.color}`}
                    aria-label={link.label}
                    title={link.label}
                  >
                    <link.icon className="w-4 h-4 text-gray-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
