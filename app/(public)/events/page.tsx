'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, Search, X, ChevronRight, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { formatDate } from '@/lib/utils';

interface Event {
  $id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  type: string;
  status: string;
  slug: string;
  posterUrl?: string;
}

const EVENT_TYPES = ['all', 'workshop', 'seminar', 'hackathon', 'talk', 'session'];

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setUpcomingEvents(data.upcoming || []);
      setPastEvents(data.past || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    const events = view === 'upcoming' ? upcomingEvents : pastEvents;
    return events.filter((event) => {
      const matchesFilter = filter === 'all' || event.type?.toLowerCase() === filter;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [upcomingEvents, pastEvents, filter, searchQuery, view]);

  if (loading) return <Loader fullscreen />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Events & Workshops
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join us for exciting events, workshops, and sessions to enhance your AI/ML skills
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
              <button
                onClick={() => setView('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'upcoming'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setView('past')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'past'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                Past ({pastEvents.length})
              </button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`badge transition-all ${filter === type
                    ? 'badge-primary'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <motion.div
              key={view + filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <EventCard key={event.$id} event={event} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
              <p className="text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Check back later for upcoming events'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const getEventImage = (event: Event) => {
    // Map event types to actual images
    const imageMap: Record<string, string> = {
      'expert talk': '/api/placeholder/600/400',
      'dspl session': '/api/placeholder/600/400',
      'workshop': '/api/placeholder/600/400',
      'default': '/api/placeholder/600/400',
    };

    return event.posterUrl || imageMap[event.type?.toLowerCase()] || imageMap.default;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      scheduled: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-warning',
    };
    return badges[status?.toLowerCase()] || 'badge-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="h-full flex flex-col overflow-hidden group">
        {/* Event Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={getEventImage(event)}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <span className={`badge ${getStatusBadge(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-purple-400 transition-colors">
            {event.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 mt-2">
            {event.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.type && (
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="capitalize">{event.type}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Link href={`/events/${event.slug}`} className="w-full">
            <Button variant="ghost" className="w-full group/btn">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
