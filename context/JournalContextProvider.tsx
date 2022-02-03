import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../firebase/firebase-config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Feeling, JournalEntry, StorageType } from '../components/utils/Models';
import {
  createEntry as createEntry_fb,
  subscribeToUserEntries as subscribeToUserEntries_fb,
  subscribeToUserFeelings as subscribeToUserFeelings_fb,
  getDefaultFeelings,
} from '../firebase/firebase-methods';

import {
  createEntry as createEntry_ls,
  subscribeToUserEntries as subscribeToUserEntries_ls,
  subscribeToUserFeelings as subscribeToUserFeelings_ls,
  setFeelingsDirectly as saveFeelingsInLocalStorage,
} from '../localStorage/localStorage-methods';
import { useAuth } from './AuthContextProvider';

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

const journalContext = createContext<ModalContextState>(null);

export const useJournalContext = () => {
  const response = useContext(journalContext);
  return response;
};

export default function JournalContextProvider({ children }) {
  const { storageType } = useAuth();

  //*State
  const [feelings, setFeelings] = useState<Feeling[]>();
  const [entries, setEntries] = useState<JournalEntry[]>();
  const [entriesByDate, setEntriesByDate] = useState<JournalDiccionary>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unsubFromFeelings, setUnsubFromFeelings] = useState<() => void>();
  const [unsubFromEntries, setUnsubFromEntries] = useState<() => void>();

  //*Methods
  function findFeeling(feelingName: string): Feeling {
    if (!feelings) return;
    return feelings.filter(
      (f) => f.name.toLocaleLowerCase() === feelingName.toLocaleLowerCase()
    )[0];
  }

  async function createEntry(newEntry: JournalEntry) {
    switch (storageType) {
      case StorageType.Firebase:
        await createEntry_fb(newEntry);
        break;
      case StorageType.Local:
        await createEntry_ls(newEntry);
        break;
      default:
        throw new Error('No storage type selected');
    }
  }

  const subscribeToUserFeelings = (user?: User) => {
    switch (storageType) {
      case StorageType.Firebase:
        subscribeToUserFeelings_fb(user, setIsLoading, setFeelings);
        break;
      default:
        const unsub = subscribeToUserFeelings_ls(
          setIsLoading,
          (feelings: Feeling[]) => {
            console.log('adding feelings');
            setFeelings(feelings);
          }
        );
        setUnsubFromFeelings(unsub);
        break;
    }
  };

  function subscribeToUserEntries(user?: User) {
    switch (storageType) {
      case StorageType.Firebase:
        subscribeToUserEntries_fb(
          user,
          setEntries,
          setEntriesByDate,
          setIsLoading
        );
        break;
      case StorageType.Local:
        const unsub = subscribeToUserEntries_ls(
          setIsLoading,
          setEntries,
          setEntriesByDate
        );
        setUnsubFromEntries(unsub);
        break;
      default:
        console.error('theres no storage type selected');
        break;
    }
  }

  function unsubscribeToAll() {
    console.log('unsubing from all');
    setEntries(null);
    setFeelings(null);
    if (unsubFromEntries) unsubFromEntries();
    if (unsubFromFeelings) unsubFromFeelings();
  }

  //*Effects
  useEffect(() => {
    switch (storageType) {
      case StorageType.Firebase:
        console.log('subsribing to firebase');
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
      case StorageType.Local:
        console.log('subsribing to local storage');
        subscribeToUserEntries();
        subscribeToUserFeelings();
        if (!feelings || feelings.length < 1) {
          console.log(
            'feelings not found. Getting default feelings from the server'
          );
          saveFeelingsInLocalStorage(getDefaultFeelings).catch((error) => {
            console.error(
              'Error trying to obtanied the default feelings',
              error
            );
          });
        }

        return () => {
          unsubscribeToAll();
        };
      default:
        console.log(storageType);
        break;
    }
  }, [storageType]);

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
