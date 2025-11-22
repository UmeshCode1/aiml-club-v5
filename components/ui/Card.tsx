'use client';

import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  tilt?: boolean;
}

export function Card({ children, hover = false, glass = true, tilt = false, className, ...props }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  const CardWrapper = tilt ? motion.div : 'div';
  const wrapperProps = tilt ? {
    style: {
      rotateX,
      rotateY,
      transformStyle: "preserve-3d",
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  } : {};

  return (
    // @ts-ignore
    <CardWrapper
      ref={ref}
      className={cn(
        'relative rounded-2xl transition-all duration-300',
        glass ? 'glass-card' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
        hover && 'hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1',
        className
      )}
      {...wrapperProps}
      {...props}
    >
      {children}
    </CardWrapper>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-display font-bold text-gray-900 dark:text-white', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-gray-500 dark:text-gray-400 text-sm leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative z-10', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-gray-100 dark:border-white/5', className)} {...props}>
      {children}
    </div>
  );
}
