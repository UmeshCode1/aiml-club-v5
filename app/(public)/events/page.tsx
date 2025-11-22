'use client';

import { useState, useEffect } from 'react';
import { databases, COLLECTIONS, subscribeToCollection, getPreviewUrl } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Event {
  $id: string;
  title: string;
  date: string;
  description: string;
  image_url: string;
  registration_link?: string;
  status: 'Open' | 'Closed' | 'Completed';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        COLLECTIONS.EVENTS,
        [Query.orderDesc('date')]
      );
      setEvents(response.documents as unknown as Event[]);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Real-time subscription
    const unsubscribe = subscribeToCollection(COLLECTIONS.EVENTS, (response) => {
      const { events: eventTypes, payload } = response;

      if (eventTypes.some(e => e.includes('create'))) {
        setEvents(prev => [payload as Event, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else if (eventTypes.some(e => e.includes('update'))) {
        setEvents(prev => prev.map(e => e.$id === payload.$id ? payload as Event : e));
      } else if (eventTypes.some(e => e.includes('delete'))) {
        setEvents(prev => prev.filter(e => e.$id !== payload.$id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date() || e.status === 'Open');
  const pastEvents = events.filter(e => new Date(e.date) < new Date() && e.status !== 'Open');

  const displayedEvents = showPast ? pastEvents : upcomingEvents;

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
            Events & Workshops
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Join us for hands-on workshops, hackathons, and tech talks. Level up your AI/ML skills with our community.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setShowPast(false)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all",
              !showPast
                ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all",
              showPast
                ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            Past Archives
          </button>
        </div>
      </div>

      {displayedEvents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {showPast ? "No past events in the archive." : "Stay tuned! New events are coming soon."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedEvents.map((event) => (
            <Card key={event.$id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900/50">
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={event.image_url || '/placeholder-event.jpg'} // Fallback if no image
                  alt={event.title}
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
                  {format(new Date(event.date), 'MMMM d, yyyy • h:mm a')}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {event.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                  {event.description}
                </p>

                {/* Action Button */}
                <div className="mt-auto">
                  {event.status === 'Open' ? (
                    <a
                      href={event.registration_link}
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
                      Event Completed
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
