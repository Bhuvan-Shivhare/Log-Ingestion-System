'use client';

import { useState } from 'react';
import { useLogs } from '@/hooks/useLogs';
import { LogQueryParams } from '@/lib/types';
import { StatsBar } from '@/components/logs/StatsBar';
import { LogsFilters } from '@/components/logs/LogsFilters';
import { LogsTable } from '@/components/logs/LogsTable';
import { PaginationControls } from '@/components/logs/PaginationControls';
import { toast } from 'sonner';

export default function LogsDashboard() {
    const [filters, setFilters] = useState<LogQueryParams>({
        page: 1,
        limit: 10,
        // Add defaults if needed
    });

    const { data, isLoading, isError, error } = useLogs(filters);

    // Show error toast if query fails
    if (isError) {
        toast.error(`Failed to fetch logs: ${(error as any)?.message}`);
    }

    const handleFilterChange = (newFilters: LogQueryParams) => {
        // Reset to page 1 when filters change (except pagination itself)
        const isPaginationChange = newFilters.page !== filters.page || newFilters.limit !== filters.limit;
        setFilters({
            ...newFilters,
            page: isPaginationChange ? newFilters.page : 1, // Stay on page if just paging, else reset
        });
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: number) => {
        setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const totalLogs = data?.pagination.total || 0;
    const totalPages = data?.pagination.totalPages || 1;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Logs Dashboard</h1>
                    <p className="text-gray-500">View and manage system logs in real-time</p>
                </div>
            </div>

            <StatsBar
                totalLogCount={totalLogs}
                isCached={data?.fromCache}
            />

            <LogsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <LogsTable
                logs={data?.data || []}
                isLoading={isLoading}
            />

            <PaginationControls
                page={filters.page || 1}
                totalPages={totalPages}
                total={totalLogs}
                limit={filters.limit || 10}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoading}
            />
        </div>
    );
}
