import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, firestore as db } from '../firebase/firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Feeling, JournalEntry } from '../models/Models';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { USERS_FEELINGS_PATH, DEFAULT_FEELINGS_PATH } from '../firebase/Paths';

type ModalContextState = {
  entries: JournalEntry[];
  feelings: Feeling[];
};

const journalContext = createContext<ModalContextState>({
  entries: [],
  feelings: [],
});

export const useJournalContext = () => {
  const response = useContext(journalContext);
  return response;
};

export default function JournalContextProvider({ children }) {
  const [feelings, setFeelings] = useState<Feeling[]>();
  const [entries, setEntries] = useState<JournalEntry[]>();

  //*Effects
  useEffect(() => {
    console.log('called effect');
    async function getUserFeelings(user: User) {
      if (!user) return;
      console.log('passed user check', user);
      const usersFeelingsColRef = collection(db, USERS_FEELINGS_PATH);
      try {
        const docRef = doc(usersFeelingsColRef, user.uid);
        const actualDoc = await getDoc(docRef);

        const feelingsInObject = actualDoc.data();
        const feelingsInArray = Object.values(feelingsInObject);
        console.log('Got the user feelings.');
        setFeelings(feelingsInArray);
      } catch (error) {
        console.error('Creating a user_doc for the user');
        //The user doesn't have feelings yet
        //we must create them.
        const defaultFeelingsCol = collection(db, DEFAULT_FEELINGS_PATH);
        const docRef = await getDoc(doc(defaultFeelingsCol, 'default'));
        const feelingsInObject = docRef.data();
        const feelingsInArray = Object.values(feelingsInObject);

        //create a doc for the user
        setFeelings(feelingsInArray);
        await setDoc(doc(usersFeelingsColRef, user.uid), feelingsInObject);
      }
    }

    async function getUserEntries(user: User) {
      try {
        const journalCollection = collection(db, 'journals');
        const q = query(journalCollection, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);

        const entries: JournalEntry[] = [];

        snapshot.forEach((s) => {
          const docData = s.data();
          const journalEntry: JournalEntry = {
            feeling: docData.feeling,
            uid: docData.uid,
            why: docData.why,
            date: new Date(docData.date),
          };
          entries.push(journalEntry);
        });

        console.log('Got the user entries');
        setEntries(entries);
      } catch (error) {
        console.error('The user has no entries');
        setEntries([]);
      }
    }
    onAuthStateChanged(auth, (user) => {
      getUserFeelings(user);
      getUserEntries(user);
    });
  }, []);

  const state = {
    entries,
    feelings,
  };

  return (
    <journalContext.Provider value={state}>{children}</journalContext.Provider>
  );
}
