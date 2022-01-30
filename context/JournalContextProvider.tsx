import React from 'react';
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
import { DateTime } from 'luxon';

export type JournalDiccionary = {
  [key: string]: JournalEntry[];
};

type ModalContextState = {
  entries: JournalEntry[];
  entriesByDate: JournalDiccionary;
  feelings: Feeling[];
  createEntry: (newEntry: JournalEntry) => Promise<void>;
  findFeeling: (feelingName: string) => Feeling;
  isLoading: boolean;
};

const journalContext = createContext<ModalContextState>({
  entries: [],
  feelings: [],
  entriesByDate: null,
  createEntry: async (newEntry: JournalEntry) => {},
  findFeeling: (feelingName: string) => null,
  isLoading: true,
});

export const useJournalContext = () => {
  const response = useContext(journalContext);
  return response;
};

export default function JournalContextProvider({ children }) {
  //*State
  const [feelings, setFeelings] = useState<Feeling[]>();
  const [entries, setEntries] = useState<JournalEntry[]>();
  const [entriesByDate, setEntriesByDate] = useState<JournalDiccionary>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //*Methods
  function findFeeling(feelingName: string): Feeling {
    if (!feelings) return;
    return feelings.filter(
      (f) => f.name.toLocaleLowerCase() === feelingName.toLocaleLowerCase()
    )[0];
  }

  async function createEntry(newEntry: JournalEntry) {
    try {
      const col = collection(db, JOURNALS_PATH);
      const response = await addDoc(col, newEntry);
      console.log(response);
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
        try {
          setIsLoading(true);
          const feelingsInObject = snapshot.data();
          if (!feelingsInObject)
            throw new Error("The user doesn't have an entry");
          const feelingsInArray = Object.values(feelingsInObject);
          setFeelings(feelingsInArray);
          setIsLoading(false);
        } catch (error) {
          throw error;
        }
      },
      (error) => {
        if (error.code === 'permission-denied') {
          console.log('out f');
        } else {
          //The user doesn't have feelings yet
          //we must create them.
          const defaultFeelingsCol = collection(db, DEFAULT_FEELINGS_PATH);
          getDoc(doc(defaultFeelingsCol, 'default')).then((docRef) => {
            const feelingsInObject = docRef.data();
            const feelingsInArray = Object.values(feelingsInObject);

            //create a doc for the user
            setFeelings(feelingsInArray);
            setDoc(userFeelingsDoc, feelingsInObject).then(() => {
              console.log('added defaults to the user');
              setIsLoading(false);
            });
          });
        }
      }
    );
  };

  function subscribeToUserEntries(user: User): Unsubscribe {
    if (!user) return;
    console.log('sub to entries on');

    const journalCollection = collection(db, JOURNALS_PATH);
    const entriesQuery = query(
      journalCollection,
      where('uid', '==', user.uid),
      orderBy('date', 'desc')
    );

    console.log();

    onSnapshot(
      entriesQuery,
      (snapshot) => {
        try {
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
          setEntries(entries);
          setEntriesByDate(organizeEntries(entries));
          console.log('updated the entries');
        } catch (error) {
          console.log('catch you', error);
        }
      },
      (error) => {
        setEntries([]);
        if (error.code === 'permission-denied') {
          console.log('out f');
        } else {
          console.error(error.code, error);
        }
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
    console.log('organizing entries');
    const result: JournalDiccionary = {};

    // const today = new Date().getTime();
    entries.forEach((entry) => {
      const entryDate = DateTime.fromISO(entry.date);

      const diffInDays = DateTime.now()
        .startOf('day')
        .diff(entryDate.startOf('day'))
        .as('days');

      const key =
        diffInDays > 0
          ? diffInDays === 1
            ? `Yesterday`
            : `${diffInDays} days ago`
          : 'Today';

      console.log(diffInDays, key);

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
    console.log('running effect');
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
    entriesByDate,
    findFeeling,
    isLoading,
  };

  return (
    <journalContext.Provider value={state}>{children}</journalContext.Provider>
  );
}
