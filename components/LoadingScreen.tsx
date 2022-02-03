import React from 'react';
import Image from 'next/image';

export default function LoadingScreen({
  message = 'Loading',
}: {
  message?: string;
}) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 opacity-70">
      <h1 className="label-xl">{message}</h1>
      <Image src="/loop.svg" height={16} width={16} className="animate-spin" />
    </div>
  );
}
