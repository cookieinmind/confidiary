import { DateTime } from 'luxon';
import { Feeling, JournalEntry } from '../components/utils/Models';
import { JournalDiccionary } from '../context/JournalContextProvider';
class Manager {
  public static entriesChanged: () => void;
  public static feelingsChanged: () => void;

  public static cleanSubscriptions() {
    console.log('todo: cleaning ');
    // if (this.entriesChanged) this.entriesChanged = null;
    // if (this.feelingsChanged) this.feelingsChanged = null;
  }
}

const KEY_FEELINGS = 'SINNER_JOURNAL_feelings';
const KEY_ENTRIES = 'SINNER_JOURNAL_entries';

class EntryPoint {
  //*Static

  //*Public
  get Feelings(): Feeling[] {
    try {
      const feelings = this.getObject(KEY_FEELINGS);
      if (feelings) return feelings;
      else throw new TypeError();
    } catch (error) {
      if (error instanceof TypeError) {
        console.log('Setting the feeling keys');
        this.setFeelingsKeys(); //Create the keys
        return this.Feelings; //try again
      } else {
        console.log(error.type);
        console.error(
          'trying to subscribe to entries but theres an error:',
          `"${error.message}"`
        );
      }
    }
  }

  set Feelings(newFeelings: Feeling[]) {
    this.setObject(KEY_FEELINGS, newFeelings);
    if (Manager.feelingsChanged) Manager.feelingsChanged();
  }

  get Entries(): JournalEntry[] {
    try {
      const entries = this.getObject(KEY_ENTRIES);
      if (entries) return entries;
      else throw new TypeError();
    } catch (error) {
      if (error instanceof TypeError) {
        this.setEntriesKeys(); //Create the keys
        return this.Entries; //try again
      } else {
        console.log(error.type);
        console.error(
          'trying to subscribe to entries but theres an error:',
          `"${error.message}"`
        );
      }
    }
  }

  set Entries(AllEntries: JournalEntry[]) {
    this.setObject(KEY_ENTRIES, AllEntries);
    if (Manager.entriesChanged) Manager.entriesChanged();
  }

  async addEntry(newEntry: JournalEntry) {
    try {
      const oldEntries = this.getObject(KEY_ENTRIES) as JournalEntry[];
      const newEntries = [...oldEntries, newEntry];
      this.Entries = newEntries;
      console.log('saved an entry in local storage');
    } catch (error) {
      console.error(error);
      this.setEntriesKeys(); //prob the local storage was cleaned
      createEntry(newEntry); //try again
    }
  }

  //*Private
  private setObject(key: string, value: Object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getObject(key: string) {
    var value = localStorage.getItem(key);
    if (value) {
      const parsedData = JSON.parse(value);
      const result = value && parsedData;
      return result;
    } else {
      return undefined;
    }
  }

  private setEntriesKeys() {
    console.log('Setting the default entry keys');
    this.Entries = [];
  }

  private setFeelingsKeys() {
    console.log('Setting the default feeling keys');
    this.Feelings = [];
  }
}

//*Private
type UnsubFromEvents = () => void;

//*Public

async function createEntry(newEntry: JournalEntry) {
  try {
    await new EntryPoint().addEntry(newEntry);
  } catch (error) {
    throw error;
  }
}

function subscribeToUserFeelings(
  setIsLoading: (val: boolean) => void,
  setFeelings: (val: Feeling[]) => void
): UnsubFromEvents {
  function getFeelings() {
    const storage = new EntryPoint();
    setIsLoading(true);
    const feelingsObject = storage.Feelings;
    setFeelings(feelingsObject);
    setIsLoading(false);
    console.log('updated the feelings');
  }

  Manager.feelingsChanged = getFeelings;
  getFeelings();
  return Manager.cleanSubscriptions;
}

function subscribeToUserEntries(
  setIsLoading: (val: boolean) => void,
  setEntries: (val: JournalEntry[]) => void,
  setEntriesByDate: (val: JournalDiccionary) => void
): UnsubFromEvents {
  const getEntries = () => {
    const storage = new EntryPoint();
    console.log('called to update the entries');
    setIsLoading(true);
    const entries = storage.Entries;
    setEntries(entries);
    setEntriesByDate(organizeEntries(entries));
    setIsLoading(false);
  };

  Manager.entriesChanged = getEntries;
  getEntries();
  return Manager.cleanSubscriptions;
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
  const storage = new EntryPoint();
  const theresFeelings = storage.Feelings.length > 0;

  if (theresFeelings) {
    console.log('theres already feelings in local storage');
    return true;
  } else {
    try {
      const feelings = await getFeelingsFromServer();
      storage.Feelings = feelings;
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
