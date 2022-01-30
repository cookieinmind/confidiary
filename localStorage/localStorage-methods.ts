import { DateTime } from 'luxon';
import { Feeling, JournalEntry } from '../components/utils/Models';
import { JournalDiccionary } from '../context/JournalContextProvider';

//*Private
type UnsubFromEvents = () => void;
const KEY_FEELINGS = 'SINNER_JOURNAL_feelings';
const KEY_ENTRIES = 'SINNER_JOURNAL_entries';

let entriesChanged: () => void = null;
let feelingsChanged: () => void = null; //! do not delete

function setObject(key: string, value: Object) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getObject(key: string) {
  var value = localStorage.getItem(key);
  if (value) {
    const parsedData = JSON.parse(value);
    const result = value && parsedData;
    return result;
  } else {
    return undefined;
  }
}

//*Public

async function createEntry(newEntry: JournalEntry) {
  try {
    const oldEntries = getObject(KEY_ENTRIES) as JournalEntry[];
    const newEntries = [...oldEntries, newEntry];
    setObject(KEY_ENTRIES, newEntries);
    console.log('saved an entry in local storage');
    entriesChanged();
  } catch (error) {
    console.error(error);
  }
}

function subscribeToUserFeelings(
  setIsLoading: (val: boolean) => void,
  setFeelings: (val: Feeling[]) => void
): UnsubFromEvents {
  function getFeelings() {
    setIsLoading(true);
    const feelingsObject = getObject(KEY_FEELINGS);
    setFeelings(feelingsObject);
    setIsLoading(false);
    console.log('updated the feelings');
  }

  feelingsChanged = getFeelings;
  try {
    getFeelings();
  } catch (error) {
    if (error instanceof TypeError) {
      console.log('Setting the default feeling keys');
      setObject(KEY_FEELINGS, []);
      feelingsChanged();
    } else {
      console.log(error.type);
      console.error(
        'trying to subscribe to entries but theres an error:',
        `"${error.message}"`
      );
    }
  }

  return () => (feelingsChanged = null);
}

function subscribeToUserEntries(
  setIsLoading: (val: boolean) => void,
  setEntries: (val: JournalEntry[]) => void,
  setEntriesByDate: (val: JournalDiccionary) => void
): UnsubFromEvents {
  const getEntries = () => {
    console.log('called to update the entries');
    setIsLoading(true);
    const entries: JournalEntry[] = [];
    const entriesFromStorage = getObject(KEY_ENTRIES) as JournalEntry[];
    entriesFromStorage.forEach((entry) => {
      entries.push(entry);
    });
    setEntries(entries);
    setEntriesByDate(organizeEntries(entries));
    console.log('updated the entries');
    setIsLoading(false);
  };

  entriesChanged = getEntries;
  try {
    getEntries();
  } catch (error) {
    if (error instanceof TypeError) {
      console.log('Setting the default entries keys');
      setObject(KEY_ENTRIES, []);
      entriesChanged();
    } else {
      console.log(error.type);
      console.error(
        'trying to subscribe to entries but theres an error:',
        `"${error.message}"`
      );
    }
  }

  return () => (entriesChanged = null);
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

    if (result.hasOwnProperty(key)) {
      result[key].push(entry);
    } else {
      result[key] = [entry];
    }

    result[key] = result[key].sort((entryA, entryB) => {
      const dateA = DateTime.fromISO(entryA.date);
      const dateB = DateTime.fromISO(entryB.date);
      return dateB.diff(dateA).as('millisecond');
    });
  });

  return result;
}

async function setFeelingsDirectly(
  getFeelingsFromServer: () => Promise<Feeling[]>
): Promise<boolean> {
  if (getObject(KEY_FEELINGS)) {
    console.log('theres already feelings in local storage');
    return true;
  } else {
    try {
      const feelings = await getFeelingsFromServer();
      setObject(KEY_FEELINGS, feelings);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export {
  createEntry,
  subscribeToUserEntries,
  subscribeToUserFeelings,
  setFeelingsDirectly,
};
