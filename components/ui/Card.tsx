'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({
  children,
  hover = false,
  gradient = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border',
        'shadow-sm backdrop-blur-sm',
        'transition-all duration-500 ease-out',
        hover && 'hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 hover:-translate-y-2 hover:scale-105 cursor-pointer hover:border-primary-300 dark:hover:border-secondary-600',
        gradient && 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/50 dark:to-secondary-950/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}
