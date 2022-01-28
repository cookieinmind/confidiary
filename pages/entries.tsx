import React from 'react';
import Layout from '../components/Layouts/Layout';
import EntryCard from '../components/cards/EntryCard';
import { useJournalContext } from '../context/JournalContextProvider';

export default function Entries() {
  const { entriesByDate } = useJournalContext();

  return (
    <div>
      <div className="flex flex-col p-2 gap-8">
        {entriesByDate &&
          Object.keys(entriesByDate).map((date, i) => {
            let entries = entriesByDate[date];
            return (
              <div key={i} className="flex flex-col gap-4">
                {entries?.map((entry, j) => {
                  return (
                    <div className="flex flex-col gap-2" key={j}>
                      {j === 0 && (
                        <h3 className="title-medium opacity-50 capitalize">
                          {date}
                        </h3>
                      )}
                      <EntryCard entry={entry} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        <div className="h-[70px] w-1 shrink-0" />
      </div>
    </div>
  );
}

Entries.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
