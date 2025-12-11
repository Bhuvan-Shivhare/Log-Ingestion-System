'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DateRangeInputs } from '@/components/ui/DateRangeInputs';
import { LogQueryParams } from '@/lib/types';
import { Search, RotateCcw, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion, registerGSAP } from '@/lib/gsapUtil';

interface LogsFiltersProps {
    filters: LogQueryParams;
    onFilterChange: (filters: LogQueryParams) => void;
}

export function LogsFilters({ filters, onFilterChange }: LogsFiltersProps) {
    const [localFilters, setLocalFilters] = useState<LogQueryParams>(filters);
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const advancedRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Initial Entry Animation with ScrollTrigger
    useIsomorphicLayoutEffect(() => {
        registerGSAP();
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                    once: true
                },
                scale: 0.97,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Expand/Collapse Animation
    useIsomorphicLayoutEffect(() => {
        if (!isExpanded || prefersReducedMotion) return;

        if (advancedRef.current) {
            gsap.fromTo(advancedRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [isExpanded]); // Run when expanded toggles

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange(localFilters);

        // Subtle pulse to indicate action
        if (!prefersReducedMotion && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.5)" },
                { boxShadow: "0 0 0 10px rgba(59, 130, 246, 0)", duration: 0.5 }
            );
        }
    };

    const handleReset = () => {
        const resetFilters: LogQueryParams = {
            page: 1,
            limit: filters.limit,
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const handleChange = (key: keyof LogQueryParams, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Card ref={containerRef} className="p-4 mb-6 !bg-white/90 shadow-md border-blue-100/50">
            <form onSubmit={handleApply} className="space-y-4">
                {/* Top Row: Primary Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Input
                            placeholder="Search logs by message..."
                            value={localFilters.message || ''}
                            onChange={(e) => handleChange('message', e.target.value)}
                            icon={<Search className="h-4 w-4" />}
                            className="flex-1 border-blue-100 focus:border-blue-400 text-black"
                        />
                    </div>

                    <Select
                        value={localFilters.level || ''}
                        onChange={(e) => handleChange('level', e.target.value)}
                        className="w-full md:w-32 border-blue-100 focus:border-blue-400 text-black"
                        options={[
                            { label: 'All Levels', value: '' },
                            { label: 'Error', value: 'error' },
                            { label: 'Warning', value: 'warning' },
                            { label: 'Info', value: 'info' },
                            { label: 'Debug', value: 'debug' },
                        ]}
                    />
                    <Button type="submit" variant="primary" className="md:w-auto w-full shadow-blue-200">
                        Search
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="md:w-auto w-full"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {isExpanded ? 'Less' : 'More'} Filters
                        {isExpanded ? <ChevronUp className="h-3 w-3 ml-2" /> : <ChevronDown className="h-3 w-3 ml-2" />}
                    </Button>
                </div>

                {/* Collapsible Advanced Filters */}
                {isExpanded && (
                    <div ref={advancedRef} className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                            <Input
                                placeholder="Resource ID"
                                label="Resource ID"
                                value={localFilters.resourceId || ''}
                                onChange={(e) => handleChange('resourceId', e.target.value)}
                                className="text-black"
                            />
                            <Input
                                placeholder="Trace ID"
                                label="Trace ID"
                                value={localFilters.traceId || ''}
                                onChange={(e) => handleChange('traceId', e.target.value)}
                                className="text-black"
                            />
                            <Input
                                placeholder="Span ID"
                                label="Span ID"
                                value={localFilters.spanId || ''}
                                onChange={(e) => handleChange('spanId', e.target.value)}
                                className="text-black"
                            />
                            <Input
                                placeholder="Commit Hash"
                                label="Commit"
                                value={localFilters.commit || ''}
                                onChange={(e) => handleChange('commit', e.target.value)}
                                className="text-black"
                            />
                            <Input
                                placeholder="Parent Resource ID"
                                label="Parent Resource"
                                value={localFilters.parentResourceId || ''}
                                onChange={(e) => handleChange('parentResourceId', e.target.value)}
                                className="text-black"
                            />

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 block mb-1">Date Range</label>
                                <DateRangeInputs
                                    from={localFilters.from || ''}
                                    to={localFilters.to || ''}
                                    onFromChange={(val) => handleChange('from', val)}
                                    onToChange={(val) => handleChange('to', val)}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button type="button" variant="ghost" onClick={handleReset} className="text-gray-500 hover:bg-gray-100 w-full justify-center border border-dashed border-gray-300">
                                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </Card>
    );
}
