"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== allowedRole) {
      router.push('/');
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}