import Image from 'next/image';
import { useEffect } from 'react';
import { auth } from '../firebase/firebase-config';
import { useRouter } from 'next/router';

export default function SearchBar() {
  const router = useRouter();

  useEffect(() => {
    function redirectToSignIn() {
      if (!auth.currentUser) router.push('/');
    }
    redirectToSignIn();
  }, [auth, router]);

  return (
    <div className="w-full flex justify-around items-center py-2 pl-4 pr-2  rounded-full drop-shadow-3 bg-surface">
      <span className="material-icons">search</span>
      <input
        type="text"
        placeholder="look through your feelings"
        className="body-base grow text-center"
      />
      {auth?.currentUser?.photoURL && (
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
