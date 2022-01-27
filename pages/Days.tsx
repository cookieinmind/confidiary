import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Chipnav from '../components/ChipsNav';
import SearchBar from '../components/Searchbar';
import { auth } from '../firebase/firebase-config';

const options = [
  'anxious',
  'proud',
  'amused',
  'offended',
  'spiteful',
  'revulsion',
  'bitter',
  'frustrated',
];

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

  if (!auth.currentUser) {
    return <></>;
  }

  return (
    <div>
      <header className="p-2">
        <SearchBar />
      </header>
      <div className="flex flex-col p-2 gap-4">
        <Chipnav options={options} />
        <TodayCard />
        <OtherDayCard />
      </div>
      <LogOutButton />
    </div>
  );
}
