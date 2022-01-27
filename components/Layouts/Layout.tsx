import React from 'react';
import Navbar from '../navbar/Navbar';

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div className="relative bg-surface text-onSurface h-screen w-screen ">
      {children}
      <Navbar />
    </div>
  );
}
