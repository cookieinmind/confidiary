import React, { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase-config';
import SearchBar from '../Searchbar';
import { useModalContext } from '../../context/ModalContextProvider';
import { onAuthStateChanged } from 'firebase/auth';
import { useJournalContext } from '../../context/JournalContextProvider';
import { StorageType } from '../utils/Models';
import { RouterPaths } from '../../context/RouterPaths';

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const { isModalOn } = useModalContext();
  const { storageType, changeStorageType } = useJournalContext();
  const router = useRouter();

  useEffect(() => {
    switch (storageType) {
      case StorageType.Firebase:
        const unsub = onAuthStateChanged(auth, (user) => {
          if (!user) signOut();
        });

        return () => {
          console.log('removing auth listener');
          unsub();
        };
      case StorageType.Local:
        console.log('the user is on local storage mode, keep it in');
        break;
      default:
        console.log(
          'Layout is signing the user out bc the storage type is undefined , look: ',
          storageType
        );
        signOut();
        break;
    }
  }, []);

  function signOut() {
    console.log('going out?');
    auth.signOut();
    router.push(RouterPaths.signIn);
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
