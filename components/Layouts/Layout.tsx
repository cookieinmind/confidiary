import React from 'react';
import Navbar from '../navbar/Navbar';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase-config';

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const router = useRouter();

  function signOut() {
    auth.signOut();
    router.push('/');
  }

  function LogOutButton() {
    return (
      <button
        className="bg-errorContainer text-onErrorContainer py-4 px-8 label-lg drop-shadow-1 rounded-md absolute bottom-16 left-0 right-0"
        onClick={signOut}
      >
        Log out
      </button>
    );
  }

  return (
    <div className="relative bg-surface text-onSurface h-screen w-screen ">
      {children}
      <LogOutButton />
      <Navbar />
    </div>
  );
}
