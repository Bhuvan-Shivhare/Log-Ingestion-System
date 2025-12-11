import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    isLoading?: boolean;
}

export function PaginationControls({
    page,
    totalPages,
    limit,
    onPageChange,
    onLimitChange,
    isLoading
}: PaginationControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="h-8 rounded-md border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                    disabled={isLoading}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="hidden sm:inline-block ml-4">
                    Page {page} of {totalPages || 1}
                </span>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages || isLoading}
                >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
