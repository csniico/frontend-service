'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Manage Your Tasks with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskMaster helps you organize your work, track your progress, and achieve your goals.
                    Simple, intuitive, and powerful.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full min-[400px]:w-auto btn-purple">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto btn-purple-outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-muted/50 shadow-xl">
                  <div className="p-4">
                    <div className="h-2 w-20 rounded-full bg-muted-foreground/20 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded-full bg-muted-foreground/20"></div>
                      <div className="h-4 w-1/2 rounded-full bg-muted-foreground/20"></div>
                      <div className="h-4 w-2/3 rounded-full bg-muted-foreground/20"></div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                      <div className="h-20 rounded-lg bg-muted-foreground/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Features That Make Task Management Simple
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to stay organized and productive
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 shadow-sm border">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 12H3" />
                    <path d="m16 6-3.5 3.5 3.5 3.5" />
                    <path d="M8 18h13" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Task Prioritization</h3>
                <p className="text-muted-foreground text-center">
                  Easily prioritize your tasks to focus on what matters most.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 shadow-sm border">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="18" rx="2" width="18" x="3" y="3" />
                    <path d="M9 14l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Task Categorization</h3>
                <p className="text-muted-foreground text-center">
                  Organize tasks into categories for better management.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4 shadow-sm border">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Due Date Tracking</h3>
                <p className="text-muted-foreground text-center">
                  Set and track due dates to never miss a deadline again.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/register">
                <Button size="lg" className="btn-purple">Start Managing Your Tasks</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}