import React from 'react';
import { useJournalContext } from '../../context/JournalContextProvider';
import { bgColorPicker, textColorPicker } from '../utils/ColorPicker';
import { Feeling } from '../../models/Models';

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
        {entriesPerFeeling?.map((e, i) => {
          return (
            <FeelingEntry key={i} feeling={e.feeling} number={e.entries} />
          );
        })}
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
  const bgColor = bgColorPicker(feeling);
  const textColor = textColorPicker(feeling);

  console.log(textColor);

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
