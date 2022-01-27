import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { auth } from '../firebase/firebase-config';

const SEARCH_ICON = '&#e8b6;';

export default function Days() {
  const router = useRouter();

  function signOut() {
    auth.signOut();
    router.push('/');
  }

  //*components
  function LogOutButton() {
    return (
      <button
        className="bg-errorContainer text-onErrorContainer py-4 px-8 label-lg drop-shadow-1 rounded-md absolute bottom-8 left-0 right-0"
        onClick={signOut}
      >
        Log out
      </button>
    );
  }

  useEffect(() => {
    function redirectToSignIn() {
      console.log(auth.currentUser);
      if (!auth.currentUser) router.push('/');
    }
    redirectToSignIn();
  }, [auth, router]);

  return (
    <div>
      <header className="p-4">
        <SearchBar />
      </header>
      <LogOutButton />
    </div>
  );
}

export function SearchBar() {
  return (
    <div className="w-full flex justify-around items-center py-2 pl-4 pr-2  rounded-full drop-shadow-3">
      <span className="material-icons">search</span>
      <input
        type="text"
        placeholder="look through your feelings"
        className="body-base grow text-center"
      />
      {auth.currentUser.photoURL && (
        <Image
          src={auth?.currentUser?.photoURL}
          height={32}
          width={32}
          className="rounded-full"
        />
      )}
    </div>
  );
}
