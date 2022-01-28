import React from 'react';
import Layout from '../components/Layouts/Layout';
import ThoughtCard from '../components/cards/ThoughtCard';
import { useJournalContext } from '../context/JournalContextProvider';

export default function Thoughts() {
  const { entries } = useJournalContext();

  return (
    <div>
      <div className="flex flex-col p-2 gap-4 h-screen">
        {entries?.map((entry, i) => {
          return (
            <div className="shrink-0" key={i}>
              <ThoughtCard entry={entry} />
            </div>
          );
        })}

        <div className="h-[70px] w-1 shrink-0" />
      </div>
    </div>
  );
}

Thoughts.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
