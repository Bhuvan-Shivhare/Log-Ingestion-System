'use client';

import { AuthForm } from '@/components/auth/AuthForm';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/lib/gsapUtil';
import gsap from 'gsap';
import { useRef } from 'react';

export default function LoginPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const userPrefersReducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        if (userPrefersReducedMotion) return;

        const ctx = gsap.context(() => {
            gsap.from(".auth-bg-blob", {
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power2.out"
            });

            gsap.from(".auth-container", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="auth-bg-blob absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/40 blur-3xl opacity-60" />
                <div className="auth-bg-blob absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl opacity-60" />
            </div>

            <div className="relative z-10 px-4 w-full flex justify-center auth-container">
                <AuthForm />
            </div>
        </div>
    );
}
