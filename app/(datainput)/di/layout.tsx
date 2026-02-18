import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'; // Or your preferred auth provider
import { authOptions } from '@/pages/api/auth/[...nextauth]';

/**
 * Dashboard Layout - Authentication Wrapper
 * This layout wraps all sub-routes (/dashboard/analytics, /dashboard/pens, etc.)
 * to ensure the user is authenticated before the page even begins to hydrate.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the server-side session
  const session = await getServerSession(authOptions);

  // 2. If no session exists, bounce them to the login page
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="min-h-screen bg-ranch-cream/20">
      {/* We can wrap the children in a SessionProvider if we need 
          client-side access to the user (e.g., JD's avatar in the header) 
      */}
      <div className="relative flex min-h-screen flex-col">
        {/* Main Dashboard Content */}
        <div className="flex-1 items-start">
          {children}
        </div>
      </div>
    </div>
  );
}