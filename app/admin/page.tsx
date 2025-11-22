'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  UserPlus,
  Upload,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  memberService,
  eventService,
  suggestionService,
  storageService,
  BUCKETS,
} from '@/lib/database';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    pendingMembers: 0,
    upcomingEvents: 0,
    suggestions: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [members, pendingMembers, events, suggestions, gallery] = await Promise.all([
        memberService.list(),
        memberService.getPending(),
        eventService.getUpcoming(),
        suggestionService.getPending(),
        storageService.listFiles(BUCKETS.GALLERY_FILES),
      ]);

      setStats({
        members: members.total,
        pendingMembers: pendingMembers.total,
        upcomingEvents: events.total,
        suggestions: suggestions.total,
        galleryImages: gallery.total,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to AIML Club Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Total Members"
          value={stats.members}
          subtitle={`${stats.pendingMembers} pending`}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          title="Upcoming Events"
          value={stats.upcomingEvents}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6" />}
          title="Pending Suggestions"
          value={stats.suggestions}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={<ImageIcon className="w-6 h-6" />}
          title="Gallery Images"
          value={stats.galleryImages}
          color="pink"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            label="Create Event"
            icon={Calendar}
            href="/admin/events?action=create"
            color="blue"
            shortcut="Ctrl+E"
          />
          <QuickActionCard
            label="Add Team Member"
            icon={UserPlus}
            href="/admin/team?action=create"
            color="green"
            shortcut="Ctrl+T"
          />
          <QuickActionCard
            label="Upload Photos"
            icon={Upload}
            href="/admin/gallery?action=upload"
            color="purple"
            shortcut="Ctrl+U"
          />
          <QuickActionCard
            label="Send Notification"
            icon={Bell}
            href="/admin/notifications?action=create"
            color="red"
            shortcut="Ctrl+N"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color, loading }: any) {
  const colors: any = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-10 w-10 rounded-lg" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-8 w-16" />
          </div>
        ) : (
          <>
            <div
              className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colors[color]} text-white mb-4`}
            >
              {icon}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ label, icon: Icon, href, color, shortcut }: any) {
  const colorClasses: any = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'hover:border-blue-500',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      hover: 'hover:border-green-500',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      hover: 'hover:border-purple-500',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      hover: 'hover:border-red-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link
      href={href}
      className={`group p-6 rounded-xl border-2 border-gray-200 dark:border-dark-border ${colors.hover} transition-all hover:shadow-lg hover:-translate-y-1`}
    >
      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className={colors.text} size={24} />
      </div>
      <h3 className="font-semibold mb-1">{label}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{shortcut}</p>
    </Link>
  );
}
