'use client';

import { Card } from '@/components/ui/Card';
import { Activity, Database, Server } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect, registerGSAP, usePrefersReducedMotion } from '@/lib/gsapUtil';

interface StatsBarProps {
    totalLogCount: number;
    isCached?: boolean;
}

export function StatsBar({ totalLogCount, isCached = false }: StatsBarProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLParagraphElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        registerGSAP(); // Ensure ScrollTrigger is registered
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Intro animation on scroll
            gsap.from(".stat-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%", // Start when top of stats hits bottom 90% of view
                    toggleActions: "play none none reverse"
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.5)"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Animate badge when status changes
    useIsomorphicLayoutEffect(() => {
        if (prefersReducedMotion || !badgeRef.current) return;

        gsap.fromTo(badgeRef.current,
            { scale: 0.9, opacity: 0.6 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }
        );
    }, [isCached]);

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="stat-card p-4 flex items-center space-x-4 border-l-4 border-l-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-sm">
                    <Database className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Logs</p>
                    <p className="text-2xl font-bold text-gray-900">{totalLogCount.toLocaleString()}</p>
                </div>
            </Card>

            <Card className="stat-card p-4 flex items-center space-x-4 border-l-4 border-l-green-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="p-3 bg-green-100 text-green-600 rounded-full shadow-sm">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">System Status</p>
                    <p className="text-xl font-bold text-green-600">Active</p>
                </div>
            </Card>

            <Card className={`stat-card p-4 flex items-center space-x-4 border-l-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${isCached ? 'border-l-blue-500' : 'border-l-purple-500'}`}>
                <div className={`p-3 rounded-full shadow-sm ${isCached ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    <Server className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Data Source</p>
                    <p
                        ref={badgeRef}
                        className={`text-xl font-bold ${isCached ? 'text-blue-600' : 'text-purple-600'}`}
                    >
                        {isCached ? 'Cached' : 'Live'}
                    </p>
                </div>
            </Card>
        </div>
    );
}
