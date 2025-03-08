"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    console.log('Current user role:', userRole);
    console.log('Required role:', allowedRole);

    if (!userRole) {
      console.log('No user role found, redirecting to login');
      router.push('/');
      return;
    }

    if (userRole !== allowedRole) {
      console.log('Role mismatch, redirecting to login');
      router.push('/');
      return;
    }

    setIsAuthorized(true);
  }, [allowedRole, router]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
} 