'use client';

import { useState, useEffect } from 'react';
import { databases, COLLECTIONS, subscribeToCollection, getPreviewUrl } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink, User, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { highlightService, Highlight } from '@/lib/database';
import Link from 'next/link';


interface Event {
  $id: string;
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  posterUrl?: string;
  registrationLink?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  venue?: string;
  category: string;
  isPublished: boolean;
  resourceLink?: string;
  driveMemoriesLink?: string;
  certificateDriveLink?: string;
}

type Tab = 'upcoming' | 'past' | 'highlights';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

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

      // Fetch Highlights (only if collection ID is configured)
      if (COLLECTIONS.HIGHLIGHTS) {
        try {
          const highlightsResponse = await highlightService.list();
          setHighlights(highlightsResponse.documents as unknown as Highlight[]);
        } catch (e) {
          console.warn('Failed to fetch highlights:', e);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription for Events
    const unsubscribeEvents = subscribeToCollection(COLLECTIONS.EVENTS, (response) => {
      const { events: eventTypes, payload } = response;
      if (eventTypes.some(e => e.includes('create'))) {
        setEvents(prev => [payload as Event, ...prev].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
      } else if (eventTypes.some(e => e.includes('update'))) {
        setEvents(prev => prev.map(e => e.$id === payload.$id ? payload as Event : e));
      } else if (eventTypes.some(e => e.includes('delete'))) {
        setEvents(prev => prev.filter(e => e.$id !== payload.$id));
      }
    });

    // Real-time subscription for Highlights (optional)
    let unsubscribeHighlights = () => { };
    if (COLLECTIONS.HIGHLIGHTS) {
      unsubscribeHighlights = subscribeToCollection(COLLECTIONS.HIGHLIGHTS, (response) => {
        const { events: eventTypes, payload } = response;
        if (eventTypes.some(e => e.includes('create'))) {
          setHighlights(prev => [payload as Highlight, ...prev]);
        } else if (eventTypes.some(e => e.includes('update'))) {
          setHighlights(prev => prev.map(h => h.$id === payload.$id ? payload as Highlight : h));
        } else if (eventTypes.some(e => e.includes('delete'))) {
          setHighlights(prev => prev.filter(h => h.$id !== payload.$id));
        }
      });
    }

    return () => {
      unsubscribeEvents();
      unsubscribeHighlights();
    };
  }, []);

  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date() || e.status === 'upcoming');
  const pastEvents = events.filter(e => new Date(e.startDate) < new Date() && e.status !== 'upcoming');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30">Registration Open</span>;
      case 'Closed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30">Closed</span>;
      case 'Completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30">Completed</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Events & Highlights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Discover our workshops, hackathons, and stories from the community.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={cn(
              "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'upcoming'
                ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={cn(
              "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'past'
                ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            Past Archives
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={cn(
              "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2",
              activeTab === 'highlights'
                ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Highlights
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {activeTab === 'highlights' ? (
        // Highlights Grid
        highlights.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
            <Sparkles className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No highlights yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;ll be sharing exciting stories and updates soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight) => (
              <Card key={highlight.$id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900/50 h-full flex flex-col">
                {/* Highlight Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>{format(new Date(highlight.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-secondary-500" />
                      <span>{highlight.author}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {highlight.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                    {highlight.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    {/* Using Link if we have a details page, otherwise just visual */}
                    {/* Assuming we might want to link to a details page later, for now just a button-like look */}
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:gap-2 transition-all cursor-pointer">
                      Read Story
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        // Events Grid (Upcoming or Past)
        (activeTab === 'upcoming' ? upcomingEvents : pastEvents).length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'past' ? "No past events in the archive." : "Stay tuned! New events are coming soon."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
              <Card key={event.$id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900/50">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.posterUrl || '/placeholder-event.jpg'}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(event.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 mb-3 font-medium">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(event.startDate), 'MMMM d, yyyy')}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {event.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-auto space-y-3">
                    {event.status === 'upcoming' ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button className="w-full group/btn" variant="primary">
                          Register Now
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </a>
                    ) : event.status === 'Closed' ? (
                      <Button className="w-full cursor-not-allowed opacity-70" disabled>
                        Registration Closed
                      </Button>
                    ) : (
                      <Button className="w-full" variant="secondary" disabled>
                        View Photos
                        <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                      </Button>
                      </a>
                    )}
                </div>
              </div>
              </Card>
        ))}
    </div>
  )
      )
}
    </div >
  );
}
