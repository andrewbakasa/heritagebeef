'use client'
import React from 'react';
import { SafeUser } from '@/app/types';
import Navbar from '@/components/beef/Navbar';
import { UserData } from './_components/userdata';
import Footer from '@/components/beef/Footer';

// Assuming these are the types for your page props
interface UsersPageProps {
  currentUser?: SafeUser | null;
  data: any; // Replace 'any' with your specific user data type
}

const UsersPage = ({ currentUser, data }: UsersPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with currentUser for session management */}
      <Navbar currentUser={currentUser} forceScrolled={true}/>

      <main className="flex-grow pt-24"> {/* pt-24 accounts for the fixed navbar height */}
        <div className="max-w-7xl mx-auto p-4 h-full overflow-x-auto">
          <UserData 
            data={data} 
            currentUser={currentUser} 
          />
          <Footer /> 
        </div>
      </main>

      {/* Footer is commented out as per your snippet, but ready if needed */}
      {/* <Footer /> */}
    </div>
  );
};

export default UsersPage;