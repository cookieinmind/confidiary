import React, { useRef } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, firestore as db } from '../firebase/firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Feeling, JournalEntry } from '../components/utils/Models';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  onSnapshot,
  FirestoreError,
  DocumentSnapshot,
  DocumentData,
  Unsubscribe,
  QuerySnapshot,
  orderBy,
} from 'firebase/firestore';

import {
  USERS_FEELINGS_PATH,
  DEFAULT_FEELINGS_PATH,
  JOURNALS_PATH,
} from '../firebase/Paths';

export type JournalDiccionary = {
  [key: string]: JournalEntry[];
};

type ModalContextState = {
  entries: JournalEntry[];
  entriesByDate: JournalDiccionary;
  feelings: Feeling[];
  createEntry: (newEntry: JournalEntry) => Promise<void>;
  findFeeling: (feelingName: string) => Feeling;
};

const journalContext = createContext<ModalContextState>({
  entries: [],
  feelings: [],
  entriesByDate: null,
  createEntry: async (newEntry: JournalEntry) => {},
  findFeeling: (feelingName: string) => null,
});

export const useJournalContext = () => {
  const response = useContext(journalContext);
  return response;
};

export default function JournalContextProvider({ children }) {
  //*State
  const [feelings, setFeelings] = useState<Feeling[]>();
  const [entries, setEntries] = useState<JournalEntry[]>();

  //*Functions
  function findFeeling(feelingName: string): Feeling {
    return feelings.filter(
      (f) => f.name.toLocaleLowerCase() === feelingName.toLocaleLowerCase()
    )[0];
  }

  async function createEntry(newEntry: JournalEntry) {
    try {
      const col = collection(db, JOURNALS_PATH);
      const response = await addDoc(col, newEntry);
    } catch (error) {
      console.error(error);
    }
  }

  const subscribeToUserFeelings = (user: User): Unsubscribe => {
    if (!user) return;

    const userFeelingsDoc = doc(collection(db, USERS_FEELINGS_PATH), user.uid);
    return onSnapshot(
      userFeelingsDoc,
      (snapshot) => {
        const feelingsInObject = snapshot.data();
        const feelingsInArray = Object.values(feelingsInObject);
        setFeelings(feelingsInArray);
      },
      (error) => {
        //The user doesn't have feelings yet
        //we must create them.
        const defaultFeelingsCol = collection(db, DEFAULT_FEELINGS_PATH);
        getDoc(doc(defaultFeelingsCol, 'default')).then((docRef) => {
          const feelingsInObject = docRef.data();
          const feelingsInArray = Object.values(feelingsInObject);

          //create a doc for the user
          setFeelings(feelingsInArray);
          setDoc(userFeelingsDoc, feelingsInObject).then(() =>
            console.log('added defaults to the user')
          );
        });
      }
    );
  };

  function subscribeToUserEntries(user: User): Unsubscribe {
    if (!user) return;
    console.log('sub to entries on');

    const journalCollection = collection(db, JOURNALS_PATH);
    // const entriesQuery = query(journalCollection, where('uid', '==', user.uid));
    const entriesQuery = query(journalCollection, orderBy('date', 'desc'));

    onSnapshot(
      entriesQuery,
      (snapshot) => {
        console.log('called next on entries');
        const entries: JournalEntry[] = [];
        snapshot.forEach((s) => {
          const docData = s.data();
          const journalEntry: JournalEntry = {
            feelingName: docData.feelingName,
            uid: docData.uid,
            why: docData.why,
            date: docData.date,
          };
          entries.push(journalEntry);
        });

        console.log('Got the user entries');
        setEntries(entries);
      },
      (error) => {
        console.log('onerrror called');
        console.error(error);
        console.error('The user has no entries');
        setEntries([]);
      }
    );

    // setUnsubFromEntries(unsub);
  }

  function unsubscribeToAll() {
    console.log('unsubing from all');
    setEntries(null);
    setFeelings(null);
    // unsubFromEntries();
    // unsubFromFeelings();
  }

  function organizeEntries(entries: JournalEntry[]): JournalDiccionary {
    if (!entries) return null;
    const result: JournalDiccionary = {};

    const today = new Date().getTime();
    entries.forEach((entry) => {
      const diffInDays = Math.round(
        (today - entry.date.toDate().getTime()) / (1000 * 3600 * 24)
      );

      const key = diffInDays > 1 ? `${diffInDays} days ago` : 'Yesterday';

      if (result.hasOwnProperty(key)) {
        result[key].push(entry);
      } else {
        result[key] = [entry];
      }
    });

    return result;
  }

  //*Effects
  useEffect(() => {
    async function setUpUserFeelings(user: User) {
      const usersFeelingsColRef = collection(db, USERS_FEELINGS_PATH);
      try {
        const docRef = doc(usersFeelingsColRef, user.uid);
        const actualDoc = await getDoc(docRef);

        const feelingsInObject = actualDoc.data();
        const feelingsInArray = Object.values(feelingsInObject);
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
      } finally {
        console.log('Setted up the user feelings.');
      }
    }

    async function setUpUserEntries(user: User) {
      try {
        const journalCollection = collection(db, JOURNALS_PATH);
        const q = query(journalCollection, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);

        const entries: JournalEntry[] = [];
        snapshot.forEach((s) => {
          const docData = s.data();
          const journalEntry: JournalEntry = {
            feelingName: docData.feelingName,
            uid: docData.uid,
            why: docData.why,
            date: new docData.date(),
          };
          entries.push(journalEntry);
        });

        console.log('Setted up the user entries');
        setEntries(entries);
      } catch (error) {
        console.error('The user has no entries');
        setEntries([]);
      }
    }

    const dropAuthObserver = onAuthStateChanged(auth, (user) => {
      if (user) {
        subscribeToUserFeelings(user);
        subscribeToUserEntries(user);
      } else unsubscribeToAll();
    });

    return () => {
      dropAuthObserver();
      unsubscribeToAll();
    };
  }, []);

  const state = {
    entries,
    feelings,
    createEntry,
    entriesByDate: organizeEntries(entries),
    findFeeling,
  };

  return (
    <journalContext.Provider value={state}>{children}</journalContext.Provider>
  );
}
