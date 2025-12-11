'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/lib/gsapUtil';
import { cn } from '@/lib/utils';

export function AuthForm() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [name, setName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [role, setRole] = useState('viewer');

    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Intro animations
            gsap.from(".auth-title", {
                y: 10,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            });

            gsap.from(".auth-input", {
                y: 10,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08, // 0.05-0.08 as requested
                ease: "power2.out",
                delay: 0.1
            });

            // Button animation - simplified to ensure visibility
            gsap.from(".auth-button", {
                y: 10,
                opacity: 0,
                duration: 0.4,
                delay: 0.3,
                ease: "power2.out",
                clearProps: "all" // Ensure it cleans up
            });
        }, containerRef);

        return () => ctx.revert();
    }, [mode]); // Re-run animation when switching modes effectively re-triggers

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Logged in successfully');
            router.push('/logs');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await register(name, regEmail, regPassword, role);
            // Auto-login after register
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Registration successful! Welcome.');
            router.push('/logs');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card ref={containerRef} className="w-full max-w-md p-8 shadow-2xl border-white/40 backdrop-blur-3xl bg-white/80">
            <div className="text-center mb-8 auth-title">
                <div className="h-12 w-12 bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-white">
                    <LogIn className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Log Ingestion System</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Secure access to system logs
                </p>

                {/* Mode Toggle */}
                <div className="flex bg-gray-100/50 p-1 rounded-lg mt-6 border border-gray-200/50">
                    <button
                        onClick={() => setMode('login')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200",
                            mode === 'login'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200",
                            mode === 'register'
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                    >
                        Register
                    </button>
                </div>
            </div>

            {mode === 'login' ? (
                <form ref={formRef} onSubmit={handleLogin} className="space-y-6">
                    <div className="auth-input">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail className="h-4 w-4" />}
                            className="text-black placeholder:text-gray-400 font-medium" // Ensure black text
                            required
                        />
                    </div>

                    <div className="auth-input">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="h-4 w-4" />}
                            className="text-black placeholder:text-gray-400 font-medium" // Ensure black text
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 auth-button shadow-blue-500/20"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Sign In with Email
                    </Button>
                </form>
            ) : (
                <form ref={formRef} onSubmit={handleRegister} className="space-y-6">
                    <div className="auth-input">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<User className="h-4 w-4" />}
                            className="text-black placeholder:text-gray-400 font-medium" // Ensure black text
                            required
                        />
                    </div>
                    <div className="auth-input">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            icon={<Mail className="h-4 w-4" />}
                            className="text-black placeholder:text-gray-400 font-medium" // Ensure black text
                            required
                        />
                    </div>

                    <div className="auth-input">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a strong password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            icon={<Lock className="h-4 w-4" />}
                            className="text-black placeholder:text-gray-400 font-medium" // Ensure black text
                            required
                        />
                    </div>

                    <div className="auth-input">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="viewer"
                                    checked={role === 'viewer'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Viewer</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Admin</span>
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 auth-button shadow-blue-500/20"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Create Account
                    </Button>
                </form>
            )}

            <div className="mt-6 text-center text-xs text-gray-400">
                <p>Protected by enterprise-grade security</p>
            </div>
        </Card>
    );
}
