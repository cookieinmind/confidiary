import { useRouter } from 'next/router';
import React from 'react';
import { auth } from '../firebase/firebase-config';

export default function Days() {
  const router = useRouter();

  return (
    <div>
      Days
      <button
        className=""
        onClick={() => {
          auth.signOut();
          router.push('/');
        }}
      >
        Log out
      </button>
    </div>
  );
}
