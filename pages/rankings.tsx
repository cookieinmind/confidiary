import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { firestore, auth } from '../firebase/firebase-config';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { USERS_TO_NOTIFY_PATH } from '../firebase/Paths';
import { UserToNotify } from '../components/utils/Models';
import { FirebaseError } from 'firebase/app';

export default function Rankings() {
  const [notifyMe, setNotifyMe] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function change(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  useEffect(() => {
    setIsLoading(true);
    async function setValue() {
      try {
        const col = collection(firestore, USERS_TO_NOTIFY_PATH);
        const d = doc(col, auth.currentUser.uid);
        const response = await getDoc(d);
        const { rankings } = response.data() as UserToNotify;
        setNotifyMe(rankings);
        inputRef.current.checked = rankings;
      } catch (error) {
        const col = collection(firestore, USERS_TO_NOTIFY_PATH);
        const d = doc(col, auth.currentUser.uid);
        const data: UserToNotify = {
          edits: false,
          rankings: false,
          insights: false,
        };
        const response = await setDoc(d, data);
        setNotifyMe(false);
        inputRef.current.checked = false;
      }
    }

    async function updateValue() {
      try {
        const col = collection(firestore, USERS_TO_NOTIFY_PATH);
        const data: UserToNotify = {
          rankings: notifyMe,
        };
        const response = await updateDoc(doc(col, auth.currentUser.uid), data);
      } catch (error) {
        let e = error as FirebaseError;
        if (e.code === 'not-found') {
          const col = collection(firestore, USERS_TO_NOTIFY_PATH);

          const data: UserToNotify = {
            rankings: notifyMe,
            edits: false,
            insights: false,
          };
          const response = await setDoc(doc(col, auth.currentUser.uid), data);
        } else console.error(error);
      }
    }

    if (notifyMe !== null) {
      updateValue();
      setIsLoading(false);
    } else {
      setValue();
      setIsLoading(false);
    }
  }, [notifyMe]);

  return (
    <div className="h-screen px-8 pt-16">
      <article className="bg-surface drop-shadow-2 rounded-lg overflow-hidden w-full">
        <header className="p-4 flex flex-col items-center justify-between bg-black text-surface">
          <span className="material-icons text-2xl opacity-50">
            engineering
          </span>
          <h1 className="title-base">rankings are in development</h1>
        </header>

        <form
          className="flex justify-between p-4 items-center"
          onSubmit={change}
        >
          <label
            htmlFor="notifyMe"
            className={`body-base ${
              isLoading ? 'opacity-10' : ''
            } transition-opacity`}
          >
            notify me when is ready
          </label>
          <input
            type="checkbox"
            name="notifyMe"
            ref={inputRef}
            disabled={isLoading}
            onChange={(newVal) => setNotifyMe(newVal.target.checked)}
            className="text-black rounded focus:ring-black focus:ring-opacity-10 ring-1 disabled:text-disabled disabled:cursor-none"
          />
        </form>
      </article>
    </div>
  );
}

Rankings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
