'use client';

export default function Loader({ fullscreen = false }: { fullscreen?: boolean }) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-bg z-50">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <LoaderSpinner />
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="relative">
      {/* Outer ring with glow */}
      <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 rounded-full shadow-lg" />
      
      {/* Spinning gradient ring */}
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary-600 border-r-secondary-600 rounded-full animate-spin" 
           style={{ animationDuration: '1s' }} />
      
      {/* Second spinning ring (opposite direction) */}
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-secondary-500 border-l-primary-500 rounded-full animate-spin opacity-50" 
           style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      
      {/* Center dot with pulse */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full animate-pulse shadow-lg shadow-primary-500/50" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg animate-fade-in">
      <div className="animate-scale-in">
        <LoaderSpinner />
      </div>
      <p className="mt-6 text-lg font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent animate-pulse">
        Loading AIML Club...
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}
