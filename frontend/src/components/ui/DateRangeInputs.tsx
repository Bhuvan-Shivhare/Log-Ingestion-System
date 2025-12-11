import * as React from 'react';
import { Input } from './Input';

interface DateRangeInputsProps {
    from: string;
    to: string;
    onFromChange: (val: string) => void;
    onToChange: (val: string) => void;
}

export function DateRangeInputs({ from, to, onFromChange, onToChange }: DateRangeInputsProps) {
    return (
        <div className="flex items-center space-x-2">
            <Input
                type="datetime-local"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                className="w-[200px] text-black"
            // label="From" // Optional label
            />
            <span className="text-gray-400">to</span>
            <Input
                type="datetime-local"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                className="w-[200px] text-black"
            // label="To"
            />
        </div>
    );
}
