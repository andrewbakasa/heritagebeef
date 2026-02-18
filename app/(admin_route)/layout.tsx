import React, { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import getCurrentUser from '../actions/getCurrentUser';

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  // 1. Get the session and current user
  //const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser();

  // 2. If no user is logged in, redirect to login page immediately
  if (!currentUser) {
    redirect('/api/auth/signin'); // Use a leading slash
  }

  // 3. Check for Admin role
  // Note: Your callback logic used plural "roles", so we use that here
  const isAdmin = currentUser?.roles?.some(
    (role: string) => role?.toLowerCase().trim() === 'admin'
  );

  // 4. If not an admin, show the Access Denied UI
  if (!isAdmin) {
    return (
      <div className="flex h-screen justify-center items-center">
        <h1 className="text-5xl text-red-500 font-bold">Access Denied</h1>
      </div>
    );
  }

  // 5. If authorized, render the admin content
  return <>{children}</>;
}
