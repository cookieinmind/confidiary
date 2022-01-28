import React, { useEffect, useState } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Chipnav from '../components/ChipsNav';
import Layout from '../components/Layouts/Layout';
import { auth } from '../firebase/firebase-config';
import { useJournalContext } from '../context/JournalContextProvider';
import ThoughtCard from '../components/cards/ThoughtCard';
import { JournalEntry } from '../models/Models';

export default function Days() {
  const { feelings, entries } = useJournalContext();
  const [todayEntries, setTodayEntries] = useState<JournalEntry[]>();

  function getTodayEntres(entries: JournalEntry[]) {
    const isToday = (someDate: Date) => {
      const today = new Date();
      return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
      );
    };
    return entries.filter((entry) => isToday(entry.date.toDate()));
  }

  useEffect(() => {
    //Today
    const newArr = getTodayEntres(entries);
    setTodayEntries(newArr);

    //Every other one
  }, [entries]);

  return (
    <div>
      <div className="flex flex-col p-2 gap-4">
        {/* <Chipnav options={options} /> */}

        <ShowTodaysCard entries={todayEntries} />

        {entries &&
          entries.map((f, i) => {
            return <ThoughtCard key={i} entry={f} />;
          })}
      </div>
    </div>
  );
}

function ShowTodaysCard({ entries }: { entries: JournalEntry[] }) {
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
    <TodayCard
      entriesPerFeeling={entriesPerFeeling}
      numOfEntries={numOfEntries}
    />
  );
}

Days.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
