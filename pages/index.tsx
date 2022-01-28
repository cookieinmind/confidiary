import Head from 'next/head';
import Image from 'next/image';
import { auth, signInWithGoogle } from '../firebase/firebase-config';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        afterSignIn();
      }
    });
  }, []);

  function afterSignIn() {
    router.push('/days');
  }

  return <SignInPage afterSignIn={afterSignIn} />;
}

function SignInPage({ afterSignIn }: { afterSignIn: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <main className="flex flex-col gap-8">
        <div>
          <h1 className="headline-lg">
            sinner
            <br />
            journal
          </h1>
          <p className="body-lg opacity-50">your personal journal</p>
        </div>
        <button
          onClick={async () => {
            await signInWithGoogle();
            if (auth.currentUser) {
              afterSignIn();
            }
          }}
          className="bg-blue-500 text-white rounded-md py-4 pr-8 pl-4 text-xl w-fit border-onSurface border-2 flex items-center  gap-4"
        >
          <figure className="mt-1">
            <Image src="/google-logo.svg" height={16} width={16} />
          </figure>
          <span className="label-lg">Sign in with Google</span>
        </button>
      </main>

      <footer className="absolute bottom-10">
        <button onClick={() => console.error('Connect this to Github')}>
          {'about >'}
        </button>
      </footer>
    </div>
  );
}
