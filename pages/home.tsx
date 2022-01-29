import React, { useEffect, useState } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Layout from '../components/Layouts/Layout';
import {
  JournalDiccionary,
  useJournalContext,
} from '../context/JournalContextProvider';
import EntryCard from '../components/cards/EntryCard';
import { JournalEntry } from '../components/utils/Models';

export default function Home() {
  const { entriesByDate, isLoading } = useJournalContext();
  const [todayEntries, setTodayEntries] = useState<JournalEntry[]>();
  const [notTodaysEntries, setNotTodaysEntries] = useState<JournalDiccionary>();

  function getTodayEntres(entries: JournalEntry[]): JournalEntry[] {
    const isToday = (someDate: Date) => {
      const today = new Date();
      return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
      );
    };
    const results = entries.filter((entry) => isToday(entry.date.toDate()));
    console.log(results);
    return results;
  }

  function filterTodaysEntries(all: JournalDiccionary): JournalDiccionary {
    if (!all) return null;
    const copy: JournalDiccionary = null;

    const arrayOfKeys = Object.keys(all);

    for (const key of arrayOfKeys) {
      const value = all[key];
      if (key !== 'Today') {
        copy[key] = value;
      }
    }

    return copy;
  }

  function pickTodaysEntries(all: JournalDiccionary): JournalEntry[] {
    if (all.hasOwnProperty('Today')) {
      return all['Today'];
    } else return undefined;
  }

  useEffect(() => {
    function setUpEntries() {
      if (!entriesByDate) return;
      //Today
      const _todayEntries = pickTodaysEntries(entriesByDate);
      setTodayEntries(_todayEntries);

      //Every other one
      const _organizedEntries = filterTodaysEntries(entriesByDate);
      setNotTodaysEntries(_organizedEntries);
    }

    setUpEntries();
  }, [entriesByDate]);

  if (!entriesByDate) return <span>Loading...</span>;

  return (
    <div>
      <div className="flex flex-col p-2 gap-4">
        {/* <Chipnav options={options} /> */}

        {!isLoading && todayEntries && (
          <ShowTodaysCard entries={todayEntries} />
        )}

        {!isLoading &&
          notTodaysEntries &&
          Object.keys(notTodaysEntries).map((day, i) => {
            let entriesPerDay = notTodaysEntries[day] as JournalEntry[];

            return (
              <ShowOtherDayCard date={day} entries={entriesPerDay} key={i} />
            );
          })}
      </div>
    </div>
  );
}

function ShowTodaysCard({ entries }: { entries: JournalEntry[] }) {
  const numOfEntries = entries.length;

  const entriesPerFeeling: { feeling: string; entries: number }[] = [];

  entries.forEach((entry) => {
    const feelingEntry = entriesPerFeeling.filter(
      (el) => el.feeling === entry.feelingName
    )[0];

    if (feelingEntry) {
      feelingEntry.entries = feelingEntry.entries + 1;
    } else {
      entriesPerFeeling.push({ feeling: entry.feelingName, entries: 1 });
    }
  });

  entriesPerFeeling.sort((a, b) => b.entries - a.entries);

  return (
    <TodayCard
      entriesPerFeeling={entriesPerFeeling}
      numOfEntries={numOfEntries}
    />
  );
}

function ShowOtherDayCard({
  date,
  entries,
}: {
  date: string;
  entries: JournalEntry[];
}) {
  const numOfEntries = entries.length;

  const entriesPerFeeling: { feeling: string; entries: number }[] = [];

  entries.forEach((entry) => {
    const theFeeling = entriesPerFeeling.filter(
      (el) => el.feeling === entry.feelingName
    )[0];

    if (theFeeling) {
      theFeeling.entries = theFeeling.entries + 1;
    } else {
      entriesPerFeeling.push({ feeling: entry.feelingName, entries: 1 });
    }
  });

  entriesPerFeeling.sort((a, b) => b.entries - a.entries);

  return (
    <OtherDayCard
      date={date}
      entriesPerFeeling={entriesPerFeeling}
      numOfEntries={numOfEntries}
    />
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
