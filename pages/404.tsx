import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { RouterPaths } from '../context/RouterPaths';

const SECONDS_TO_REDIRECT = 2;

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(RouterPaths.signIn);
    }, SECONDS_TO_REDIRECT * 1000);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4 gap-4">
      <Image src="/Logo-Dark.svg" height={40} width={40} />
      <h1 className="display-lg  w-full text-center">
        <span className="font-bold">404</span>
        <br /> Page not found
      </h1>
      <p className="flex items-center gap-2">
        redirecting
        <span className="material-icons animate-spin text-xl">loop</span>
      </p>
    </div>
  );
}
