'use client';

import { Log } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ChevronDown, ChevronRight, Clock, Box } from 'lucide-react';
import * as React from 'react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LogRowExpanded } from './LogRowExpanded';
import { SkeletonTable } from '@/components/ui/SkeletonTable';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/lib/gsapUtil';

interface LogsTableProps {
    logs: Log[];
    isLoading: boolean;
}

export function LogsTable({ logs, isLoading }: LogsTableProps) {
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
    const tableRef = useRef<HTMLTableSectionElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Staggered Row Animation when logs change
    useIsomorphicLayoutEffect(() => {
        if (isLoading || logs.length === 0 || prefersReducedMotion) return;

        if (tableRef.current) {
            // Kill any existing animations on these elements to prevents conflict
            gsap.killTweensOf(".log-row");

            gsap.fromTo(".log-row",
                { opacity: 0, y: 15 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.03, // 0.03 for subtle effect
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, [logs, isLoading]);

    const toggleExpand = (id: string) => {
        setExpandedLogId(expandedLogId === id ? null : id);
    };

    const getLevelVariant = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error': return 'destructive';
            case 'warning': return 'warning';
            case 'info': return 'info';
            case 'debug': return 'gray';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return <SkeletonTable />;
    }

    if (logs.length === 0) {
        return (
            <Card className="p-12 text-center text-gray-500 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Box className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
                <p className="mt-1">Try adjusting your filters or search terms.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm transition-shadow hover:shadow-2xl duration-500">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4 w-10"></th>
                            <th className="px-6 py-4">Level</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Resource ID</th>
                            <th className="px-6 py-4">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody ref={tableRef} className="divide-y divide-gray-100">
                        {logs.map((log) => {
                            const isExpanded = expandedLogId === log._id;
                            return (
                                <React.Fragment key={log._id}>
                                    <tr
                                        onClick={() => toggleExpand(log._id)}
                                        className={cn(
                                            "log-row cursor-pointer transition-all duration-200 group relative",
                                            isExpanded ? "bg-blue-50/40" : "hover:bg-blue-50/30 hover:-translate-y-[1px]" // Micro-interaction
                                        )}
                                    >
                                        <td className="px-6 py-4 text-gray-400">
                                            {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-500" /> : <ChevronRight className="h-4 w-4 group-hover:text-blue-500 transition-colors" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getLevelVariant(log.level)} className="uppercase shadow-sm">
                                                {log.level}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate" title={log.message}>
                                            {log.message}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                                {log.resourceId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="bg-blue-50/10">
                                            <td colSpan={5} className="px-0 py-0 border-0">
                                                {/* Wrapper for smooth height animation could go here, but doing it inside LogRowExpanded for simplicity */}
                                                <div className="overflow-hidden">
                                                    <LogRowExpanded log={log} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
