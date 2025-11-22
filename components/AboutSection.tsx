'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    {/* Text Content */}
                    <div className="space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold"
                        >
                            About{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                AIML Club
                            </span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-4 text-gray-300 leading-relaxed"
                        >
                            <p>
                                The AI & Machine Learning Club at Oriental College of Technology is a student-driven community dedicated to exploring and advancing the fields of Artificial Intelligence and Machine Learning.
                            </p>
                            <p>
                                We organize workshops, seminars, hackathons, and hands-on projects to help students develop practical skills and stay updated with the latest trends in AI/ML technology.
                            </p>
                            <p>
                                Our mission is to create a collaborative environment where students can learn, experiment, and innovate together, preparing them for the future of technology.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                                <span className="text-blue-400 font-semibold">Workshops</span>
                            </div>
                            <div className="px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                                <span className="text-purple-400 font-semibold">Hackathons</span>
                            </div>
                            <div className="px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 backdrop-blur-sm">
                                <span className="text-pink-400 font-semibold">Projects</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative group"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]">
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                            <Image
                                src="/Images/inauguration/IMG_3218.JPG"
                                alt="AIML Club Team"
                                width={800}
                                height={500}
                                className="w-full h-auto object-cover"
                                priority
                            />

                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                                <p className="text-white font-semibold text-lg">AIML Club Inauguration</p>
                                <p className="text-white/80 text-sm">Celebrating the launch of our AI & Machine Learning community</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
