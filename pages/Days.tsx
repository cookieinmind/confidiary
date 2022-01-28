import React, { useEffect, useState } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Chipnav from '../components/ChipsNav';
import Layout from '../components/Layouts/Layout';
import { auth } from '../firebase/firebase-config';
import { useJournalContext } from '../context/JournalContextProvider';
import ThoughtCard from '../components/cards/ThoughtCard';
import { JournalEntry } from '../models/Models';

type JournalDiccionary = {
  [key: string]: JournalEntry[];
};

export default function Days() {
  const { feelings, entries: entriesFromServer } = useJournalContext();
  const [todayEntries, setTodayEntries] = useState<JournalEntry[]>();
  const [organizedEntries, setOganizedEntries] = useState<JournalDiccionary>();

  function getTodayEntres(entries: JournalEntry[]): JournalEntry[] {
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

  function organizeEntries(entries: JournalEntry[]): JournalDiccionary {
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

  useEffect(() => {
    function setUpEntries() {
      if (!entriesFromServer) return;
      //Today
      const _todayEntries = getTodayEntres(entriesFromServer);
      setTodayEntries(_todayEntries);

      //Every other one
      const notTodayEntries = entriesFromServer.filter(
        (x) => !_todayEntries.includes(x)
      );
      const _organizedEntries = organizeEntries(notTodayEntries);
      console.table(_organizedEntries);
      setOganizedEntries(_organizedEntries);
    }

    setUpEntries();
  }, [entriesFromServer]);

  if (!entriesFromServer) return <span>Loading...</span>;

  return (
    <div>
      <div className="flex flex-col p-2 gap-4">
        {/* <Chipnav options={options} /> */}

        {todayEntries && <ShowTodaysCard entries={todayEntries} />}

        {organizedEntries &&
          Object.keys(organizedEntries).map((day, i) => {
            let entriesPerDay = organizedEntries[day] as JournalEntry[];

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

Days.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
