'use client';

import { Log } from '@/lib/types';
import { useRef } from 'react';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/lib/gsapUtil';

interface LogRowExpandedProps {
    log: Log;
}

export function LogRowExpanded({ log }: LogRowExpandedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        if (prefersReducedMotion) return;

        // Expand animation
        gsap.fromTo(containerRef.current,
            { height: 0, opacity: 0 },
            { height: 'auto', opacity: 1, duration: 0.3, ease: "power2.out" }
        );
    }, []);

    return (
        <div ref={containerRef} className="p-4 pl-16 bg-gradient-to-b from-blue-50/40 to-white/0 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-4">
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trace Context</h4>
                    <div className="bg-white/80 p-3 rounded-lg border border-gray-100 shadow-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Trace ID</span>
                            <span className="font-mono text-gray-900 select-all">{log.traceId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Span ID</span>
                            <span className="font-mono text-gray-900 select-all">{log.spanId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Commit</span>
                            <span className="font-mono text-gray-900 select-all">{log.commit}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metadata</h4>
                    <div className="bg-white/80 p-3 rounded-lg border border-gray-100 shadow-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Resource ID</span>
                            <span className="font-mono text-gray-900 select-all">{log.resourceId}</span>
                        </div>
                        {log.metadata?.parentResourceId && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Parent Resource</span>
                                <span className="font-mono text-gray-900 select-all">{log.metadata.parentResourceId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Raw Data</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono shadow-inner border border-gray-800">
                    {JSON.stringify(log, null, 2)}
                </pre>
            </div>
        </div>
    );
}
