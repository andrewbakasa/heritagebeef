// app/dashboard/page.tsx
import React, { Suspense } from 'react';
import FeedlotDashboard from './MainDashBoardClient';
import getCurrentUser from '@/app/actions/getCurrentUser';
import DashboardLoader from './_components/Forms/DashBoardLoader';

/**
 * SERVER COMPONENT
 * Fetches the session on the server to prevent layout shift 
 * and handles the initial Suspense boundary.
 */
export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<DashboardLoader />}>
        {/* Pass the server data to the client component */}
        <FeedlotDashboard currentUser={currentUser} />
      </Suspense>
    </div>
  );
}
// import React, { Suspense } from 'react';
// import FeedlotDashboard from './MainDashBoardClient';
// import getCurrentUser from '@/app/actions/getCurrentUser';

// /**
//  * Feedlot Management System - Main Entry Point
//  * * This page serves as the root for the cattle management command center.
//  * It uses the "ranch-modern" design system colors defined in the tailwind config.
//  */
// // eslint-disable-next-line @next/next/no-async-client-component
// export default async function DashboardPage() {
//   const currentUser= await getCurrentUser();
//   return (
//     // The main wrapper ensures the dashboard takes up the full viewport 
//     // and handles overflow appropriately for a "SaaS" feel.
//     <div className="min-h-screen bg-white">
//       <Suspense fallback={<DashboardLoader />}>
//         <FeedlotDashboard currentUser={currentUser} />
//       </Suspense>
//     </div>
//   );
// }

// /**
//  * A simple skeleton loader to show while the dashboard 
//  * components or initial data are mounting.
//  */
// function DashboardLoader() {
//   return (
//     <div className="flex h-screen w-full items-center justify-center bg-ranch-cream/30">
//       <div className="flex flex-col items-center gap-4">
//         {/* Animated pulse loader matching the brand color */}
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-ranch-forest border-t-transparent"></div>
//         <p className="font-serif text-sm font-bold text-ranch-charcoal animate-pulse uppercase tracking-widest">
//           Syncing Herd Data...
//         </p>
//       </div>
//     </div>
//   );
// }