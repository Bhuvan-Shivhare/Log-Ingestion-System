'use client';

import { useState, useEffect, useRef } from 'react';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { LogOut, LayoutDashboard, Menu, X, Terminal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/lib/gsapUtil';

export function AppShell({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        // Client-side user check
        const currentUser = getUser();
        if (!currentUser) {
            router.push('/login');
        } else {
            setUser(currentUser);
        }
    }, [router]);

    useIsomorphicLayoutEffect(() => {
        if (!user || prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // Sidebar animation
            gsap.from(".app-sidebar", {
                x: -40,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all" // Clear transform after animation to allow CSS transitions/state
            });

            // Topbar animation
            gsap.from(".app-header", {
                y: -20,
                opacity: 0,
                duration: 0.6,
                delay: 0.1,
                ease: "power2.out",
                clearProps: "all"
            });

            // Main content fade in
            gsap.from(".app-content", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                delay: 0.2,
                ease: "power2.out",
                clearProps: "all"
            });
        }, containerRef);

        return () => ctx.revert();
    }, [user]); // Run only when user is confirmed (first load)

    if (!user) return null; // Or a loading spinner

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { label: 'Logs', href: '/logs', icon: <LayoutDashboard className="h-5 w-5" /> },
    ];

    return (
        <div ref={containerRef} className="flex min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "app-sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static inset-y-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center border-b border-gray-200 px-6">
                    <Terminal className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        LogSystem
                    </span>
                    <button
                        className="ml-auto lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    "hover:translate-x-1", // Micro-interaction via CSS
                                    isActive
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>

                                {/* Active indicator pill (CSS based simplifies this vs GSAP for just one item) */}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                )}
                            </a>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase ring-2 ring-white">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 hover:pl-6 transition-all"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="app-header lg:hidden flex h-16 items-center border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="ml-4 text-lg font-bold text-gray-900">
                        Log Ingestion
                    </span>
                </header>

                <main className="app-content flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
