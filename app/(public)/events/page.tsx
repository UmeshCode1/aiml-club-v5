'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Filter, Search, X } from 'lucide-react';
import Card from '@/components/ui/Card';
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
  posterId?: string;
}

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

  const filteredEvents =
    view === 'upcoming' ? upcomingEvents : pastEvents;

  const displayEvents = useMemo(() => {
    let events = filter === 'all'
      ? filteredEvents
      : filteredEvents.filter((e) => e.type === filter);

    // Apply search filter
    if (searchQuery) {
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return events;
  }, [filteredEvents, filter, searchQuery]);

  if (loading) return <Loader fullscreen />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our <span className="gradient-text">Events</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our workshops, seminars, hackathons, and more
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events by title, description, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('upcoming')}
              className={`px-6 py-2 rounded-md transition-colors ${
                view === 'upcoming'
                  ? 'bg-white dark:bg-dark-card shadow-md'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setView('past')}
              className={`px-6 py-2 rounded-md transition-colors ${
                view === 'past'
                  ? 'bg-white dark:bg-dark-card shadow-md'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Past ({pastEvents.length})
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-dark-card border-gray-300 dark:border-dark-border"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="session">Session</option>
              <option value="talk">Talk</option>
              <option value="test">Test</option>
              <option value="hackathon">Hackathon</option>
              <option value="guest_lecture">Guest Lecture</option>
              <option value="orientation">Orientation</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        {displayEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayEvents.map((event, index) => (
              <EventCard key={event.$id} event={event} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/50 dark:to-secondary-900/50 mb-6">
              <Calendar className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
              {searchQuery ? 'No events found' : view === 'upcoming' ? 'No upcoming events' : 'No past events'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find any events matching "${searchQuery}". Try a different search term.`
                : view === 'upcoming'
                ? 'Stay tuned! We\'re planning exciting workshops and events for you.'
                : 'Check back later for our event history and highlights.'}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Link href={`/events/${event.slug}`}>
        <Card hover className="h-full overflow-hidden group">
          {/* Poster */}
          {event.posterId ? (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={`https://fra.cloud.appwrite.io/v1/storage/buckets/events/files/${event.posterId}/view?project=691e2b31003e6415bb4f`}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/50 to-secondary-400/50 animate-gradient-xy" />
              <Calendar className="w-16 h-16 text-white opacity-50 relative z-10" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full capitalize">
                {event.type.replace('_', ' ')}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                  event.status === 'scheduled'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {event.status}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-3 line-clamp-2">
              {event.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
