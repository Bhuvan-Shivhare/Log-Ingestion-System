import * as React from 'react';
import { cn } from '@/lib/utils';

export function SkeletonTable() {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
                <div className="h-8 w-32 bg-gray-200 rounded-md"></div>
                <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-10 bg-gray-50 border-b border-gray-200"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <div className="w-24 h-4 bg-gray-200 rounded mr-4"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-full mr-4"></div>
                        <div className="flex-1 h-4 bg-gray-200 rounded mr-4"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
