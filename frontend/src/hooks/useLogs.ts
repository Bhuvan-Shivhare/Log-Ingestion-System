import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getLogs } from '@/lib/apiClient';
import { LogQueryParams } from '@/lib/types';

export function useLogs(params: LogQueryParams) {
    return useQuery({
        queryKey: ['logs', JSON.stringify(params)], // Ensure deep comparison for obj params
        queryFn: () => getLogs(params),
        placeholderData: keepPreviousData,
    });
}
