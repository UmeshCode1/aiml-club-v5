'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const inaugurationImages = [
    '/Images/inauguration/IMG_3218.JPG',
    '/Images/inauguration/IMG_3219.JPG',
    '/Images/inauguration/IMG_3237.JPG',
    '/Images/inauguration/IMG_3241.JPG',
    '/Images/inauguration/IMG_3244.JPG',
    '/Images/inauguration/IMG_3249.JPG',
    '/Images/inauguration/IMG_3252.JPG',
    '/Images/inauguration/IMG_3255.JPG',
    '/Images/inauguration/IMG_3256.JPG',
    '/Images/inauguration/IMG_3259.JPG',
    '/Images/inauguration/IMG_3260.JPG',
    '/Images/inauguration/IMG_3262.JPG',
    '/Images/inauguration/IMG_3268.JPG',
    '/Images/inauguration/IMG_3272.JPG',
    '/Images/inauguration/IMG_3280.JPG',
    '/Images/inauguration/IMG_3287.JPG',
    '/Images/inauguration/IMG_3299.JPG',
    '/Images/inauguration/IMG_3300.JPG',
    '/Images/inauguration/IMG_3302.JPG',
    '/Images/inauguration/IMG_3306.JPG',
];

export default function InaugurationCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % inaugurationImages.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + inaugurationImages.length) % inaugurationImages.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % inaugurationImages.length);
    };

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto">
            {/* Carousel Container */}
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {/* Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={inaugurationImages[currentIndex]}
                        alt={`Inauguration ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0}
                        quality={90}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">AIML Club Inauguration</h3>
                        <p className="text-white/90">Celebrating the launch of our AI & Machine Learning community</p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 group"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 group"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
                {inaugurationImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? 'w-8 bg-primary-500'
                                : 'w-2 bg-gray-400 dark:bg-gray-600 hover:bg-primary-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mt-4">
                <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                    {isAutoPlaying ? '⏸ Pause' : '▶ Play'} Slideshow
                </button>
            </div>
        </div>
    );
}
