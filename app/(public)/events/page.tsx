'use client';

import { useState, useEffect } from 'react';
import { databases, COLLECTIONS, subscribeToCollection } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles, Image as ImageIcon, Award } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Event {
  $id: string;
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  posterUrl?: string;
  posterId?: string;
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  venue?: string;
  category: string;
  isPublished: boolean;
  resourceLink?: string;
  driveMemoriesLink?: string;
  certificateDriveLink?: string;
}

interface Highlight {
  $id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageId?: string;
  category: string;
  isPublished: boolean;
  resourceLink?: string;
}

type Tab = 'upcoming' | 'past' | 'highlights';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribeEvents = subscribeToCollection(COLLECTIONS.EVENTS, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        setEvents(prev => [response.payload as Event, ...prev]);
      } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        setEvents(prev => prev.map(e => e.$id === response.payload.$id ? response.payload as Event : e));
      } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
        setEvents(prev => prev.filter(e => e.$id !== response.payload.$id));
      }
    });

    const unsubscribeHighlights = subscribeToCollection(COLLECTIONS.HIGHLIGHTS, (response) => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        setHighlights(prev => [response.payload as Highlight, ...prev]);
      } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
        setHighlights(prev => prev.map(h => h.$id === response.payload.$id ? response.payload as Highlight : h));
      } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
        setHighlights(prev => prev.filter(h => h.$id !== response.payload.$id));
      }
    });

    return () => {
      unsubscribeEvents();
      unsubscribeHighlights();
    };
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Events
      const eventsResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.EVENTS,
        [
          Query.equal('isPublished', true),
          Query.orderDesc('startDate')
        ]
      );
      setEvents(eventsResponse.documents as unknown as Event[]);

      // Fetch Highlights
      const highlightsResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.HIGHLIGHTS,
        [
          Query.equal('isPublished', true),
          Query.limit(6)
        ]
      );
      setHighlights(highlightsResponse.documents as unknown as Highlight[]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.startDate);
    const now = new Date();
    return eventDate >= now || e.status === 'upcoming';
  });

  const pastEvents = events.filter(e => {
    const eventDate = new Date(e.startDate);
    const now = new Date();
    return eventDate < now && e.status !== 'upcoming';
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      ongoing: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      completed: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30'
    };

    const labels = {
      upcoming: 'Upcoming',
      ongoing: 'Ongoing',
      completed: 'Completed'
    };

    return (
      <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', badges[status as keyof typeof badges] || badges.upcoming)}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[450px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'past' ? pastEvents : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Events & Highlights
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our exciting events, workshops, and memorable moments
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Calendar },
            { id: 'past', label: 'Past Events', icon: Clock },
            { id: 'highlights', label: 'Highlights', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {activeTab === 'highlights' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <HighlightCard key={highlight.$id} highlight={highlight} index={index} />
            ))}
            {highlights.length === 0 && (
              <div className="col-span-full text-center py-20">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No highlights yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Check back soon for amazing moments!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, index) => (
              <EventCard key={event.$id} event={event} index={index} getStatusBadge={getStatusBadge} />
            ))}
            {displayEvents.length === 0 && (
              <div className="col-span-full text-center py-20">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No {activeTab} events
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeTab === 'upcoming' ? 'Stay tuned for upcoming events!' : 'No past events to display.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index, getStatusBadge }: { event: Event; index: number; getStatusBadge: (status: string) => JSX.Element }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError || !event.posterUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(event.name)}&background=7c3aed&color=fff&size=600&bold=true`;
    }
    return event.posterUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-gray-800/30">
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <Image
            src={getImageUrl()}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            {getStatusBadge(event.status)}
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-bold text-gray-900 dark:text-white backdrop-blur-sm">
              {event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
            {event.name}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="line-clamp-1">{event.venue}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex flex-wrap gap-2">
            {event.registrationLink && event.status === 'upcoming' && (
              <Link href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" variant="primary" className="w-full">
                  Register Now
                </Button>
              </Link>
            )}
            {event.driveMemoriesLink && (
              <Link href={event.driveMemoriesLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Memories
                </Button>
              </Link>
            )}
            {event.certificateDriveLink && (
              <Link href={event.certificateDriveLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  Certificates
                </Button>
              </Link>
            )}
            {event.resourceLink && (
              <Link href={event.resourceLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Resources
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function HighlightCard({ highlight, index }: { highlight: Highlight; index: number }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError || !highlight.imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(highlight.title)}&background=random&size=600`;
    }
    return highlight.imageUrl;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-gray-900/50 to-gray-800/30">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={getImageUrl()}
            alt={highlight.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full bg-yellow-500/90 text-xs font-bold text-gray-900 backdrop-blur-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Highlight
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 transition-all">
            {highlight.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
            {highlight.description}
          </p>

          {highlight.resourceLink && (
            <Link href={highlight.resourceLink} target="_blank" rel="noopener noreferrer" className="mt-auto">
              <Button size="sm" variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View More
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
