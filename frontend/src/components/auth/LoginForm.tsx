'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { Mail, Lock, LogIn } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await login(email, password);

            // Store session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Store as JSON string

            toast.success('Logged in successfully');
            router.push('/logs');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-8 shadow-2xl border-white/40">
            <div className="text-center mb-8">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                    <LogIn className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Sign in to access the Log Ingestion System
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-4 w-4" />}
                    required
                />

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                <p>Already authenticated? <a href="/logs" className="text-blue-600 hover:underline font-medium">Go to Dashboard</a></p>
            </div>
        </Card>
    );
}
