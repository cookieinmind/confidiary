import React, { useEffect } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Chipnav from '../components/ChipsNav';
import Layout from '../components/Layouts/Layout';
import { auth } from '../firebase/firebase-config';
import { useJournalContext } from '../context/JournalContextProvider';
import ThoughtCard from '../components/cards/ThoughtCard';

export default function Days() {
  const { feelings, entries } = useJournalContext();
  return (
    <div>
      <div className="flex flex-col p-2 gap-4">
        {/* <Chipnav options={options} /> */}
        {entries &&
          entries.map((f, i) => {
            return <ThoughtCard key={i} entry={f} />;
          })}
      </div>
    </div>
  );
}

Days.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
