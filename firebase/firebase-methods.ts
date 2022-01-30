import {
  addDoc,
  collection,
  Unsubscribe,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Feeling, JournalEntry } from '../components/utils/Models';
import { JournalDiccionary } from '../context/JournalContextProvider';
import {
  DEFAULT_FEELINGS_PATH,
  JOURNALS_PATH,
  USERS_FEELINGS_PATH,
} from './Paths';
import { firestore as db } from './firebase-config';
import { DateTime } from 'luxon';

async function createEntry(newEntry: JournalEntry) {
  try {
    const col = collection(db, JOURNALS_PATH);
    const response = await addDoc(col, newEntry);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const subscribeToUserFeelings = (
  user: User,
  setIsLoading: (val: boolean) => void,
  setFeelings: (val: Feeling[]) => void
): Unsubscribe => {
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

function subscribeToUserEntries(
  user: User,
  setEntries: (val: JournalEntry[]) => void,
  setEntriesByDate: (val: JournalDiccionary) => void,
  setIsLoading: (val: boolean) => void
): Unsubscribe {
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
        setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        console.log('catch you', error);
        setIsLoading(false);
      }
    },
    (error) => {
      setEntries([]);
      if (error.code === 'permission-denied') {
        console.log('out f');
      } else {
        console.error(error.code, error);
      }
      setIsLoading(false);
    }
  );

  // setUnsubFromEntries(unsub);
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

async function getDefaultFeelings(): Promise<Feeling[]> {
  console.log('calling server for the default feelings');
  const col = collection(db, DEFAULT_FEELINGS_PATH);
  const feelingsAsObject = await (await getDocs(col)).docs.at(0).data();
  const feelings = Object.values(feelingsAsObject) as Feeling[];
  return feelings;
}

export {
  createEntry,
  subscribeToUserEntries,
  subscribeToUserFeelings,
  getDefaultFeelings,
};
