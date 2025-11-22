import { Card } from './Card';

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
        </div>
      </div>
    </Card>
  );
}

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
      </div>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white dark:bg-dark-card rounded-lg">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
