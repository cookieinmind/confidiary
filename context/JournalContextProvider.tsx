import React, { useRef } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, firestore as db } from '../firebase/firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Feeling, JournalEntry } from '../models/Models';
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
} from 'firebase/firestore';

import {
  USERS_FEELINGS_PATH,
  DEFAULT_FEELINGS_PATH,
  JOURNALS_PATH,
} from '../firebase/Paths';

type ModalContextState = {
  entries: JournalEntry[];
  feelings: Feeling[];
  createEntry: (newEntry: JournalEntry) => Promise<void>;
};

const journalContext = createContext<ModalContextState>({
  entries: [],
  feelings: [],
  createEntry: async (newEntry: JournalEntry) => {},
});

export const useJournalContext = () => {
  const response = useContext(journalContext);
  return response;
};

export default function JournalContextProvider({ children }) {
  const [feelings, setFeelings] = useState<Feeling[]>();
  const [entries, setEntries] = useState<JournalEntry[]>();
  // const [unsubFromFeelings, setUnsubFromFeelings] = useState<Unsubscribe>();
  // const [unsubFromEntries, setUnsubFromEntries] = useState<Unsubscribe>();

  //*Functions
  async function createEntry(newEntry: JournalEntry) {
    console.log('called createEntry');
    try {
      const col = collection(db, JOURNALS_PATH);
      const response = await addDoc(col, newEntry);
    } catch (error) {
      console.error(error);
    }
  }

  const subscribeToUserFeelings = (user: User): Unsubscribe => {
    if (!user) return;
    console.log('sub to feelings on');

    const userFeelingsDoc = doc(collection(db, USERS_FEELINGS_PATH), user.uid);
    return onSnapshot(
      userFeelingsDoc,
      (snapshot) => {
        const feelingsInObject = snapshot.data();
        const feelingsInArray = Object.values(feelingsInObject);
        console.log('Got the user feelings.');
        setFeelings(feelingsInArray);
      },
      (error) => {
        console.log('Creating a user_doc for the user', error);
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
    const entriesQuery = query(journalCollection);

    return onSnapshot(
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
            date: new Date(docData.date),
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
            date: new Date(docData.date),
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
      // console.log('x');
      if (user) {
        subscribeToUserFeelings(auth.currentUser);
        subscribeToUserEntries(auth.currentUser);
      } else unsubscribeToAll();
    });

    return () => {
      dropAuthObserver();
      unsubscribeToAll();
    };
  }, []);

  useEffect(() => {
    console.log('they changed');
  }, [feelings, entries]);

  const state = {
    entries,
    feelings,
    createEntry,
  };

  return (
    <journalContext.Provider value={state}>{children}</journalContext.Provider>
  );
}
