'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import HomeClient from '@/app/home-client';
import ProtectedRoute from '@/components/protected-route';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.firstName || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <HomeClient />
      </div>
    </ProtectedRoute>
  );
}
