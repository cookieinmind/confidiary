import React, { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase-config';
import SearchBar from '../Searchbar';
import { useModalContext } from '../../context/ModalContextProvider';
import { onAuthStateChanged } from 'firebase/auth';

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const { isModalOn } = useModalContext();

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) signOut();
    });

    return () => {
      unsub();
    };
  }, []);

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
    <div
      className={`relative bg-surface text-onSurface h-screen w-screen ${
        isModalOn ? 'overflow-x-hidden' : ''
      }`}
    >
      <header className="z-10 fixed top-0 left-0 right-0 p-2">
        <SearchBar />
      </header>
      <div className="py-16">{children}</div>

      <div className="z-10 fixed bottom-0 w-screen drop-shadow-5">
        <Navbar />
      </div>
    </div>
  );
}
