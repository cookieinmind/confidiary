import React, { useEffect } from 'react';
import { useJournalContext } from '../../context/JournalContextProvider';
import { textColorPicker } from '../utils/ColorPicker';

type TodayCardProps = {
  numOfEntries: number;
  entriesPerFeeling: { feeling: string; entries: number }[];
};

export default function TodayCard({
  numOfEntries,
  entriesPerFeeling,
}: TodayCardProps) {
  //todays entries
  //all the feelings and how many entries per feeling

  return (
    <article className="drop-shadow-2 rounded-lg  bg-surface overflow-hidden">
      <CardHeader number={numOfEntries} />
      <div className="flex flex-col gap-4 p-4">
        {entriesPerFeeling?.length > 0 &&
          entriesPerFeeling?.map((e, i) => {
            return (
              <FeelingEntry key={i} feeling={e.feeling} number={e.entries} />
            );
          })}

        {numOfEntries < 1 && (
          <h3 className="title-lg opacity-50 text-center">
            You haven't added any entries to your journal.
          </h3>
        )}
      </div>
    </article>
  );
}

function FeelingEntry({
  feeling: feelingName,
  number,
}: {
  feeling: string;
  number: number;
}) {
  const { findFeeling } = useJournalContext();
  const feeling = findFeeling(feelingName);
  const textColor = textColorPicker(feeling);

  return (
    <div className="flex justify-between items-center ">
      <span className={`text-sm font-bold ${textColor}`}>{feelingName}</span>
      <span className={`label-base`}>{number}</span>
    </div>
  );
}

function CardHeader({ number }: { number: number }) {
  return (
    <header className="p-4 flex items-center justify-between bg-black text-surface">
      <span className="title-base">{'Today'}</span>
      <span className="label-lg">{number}</span>
    </header>
  );
}
