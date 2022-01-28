import React from 'react';

type CardProps = {
  date: string;
  numOfEntries: number;
  entriesPerFeeling: { feeling: string; entries: number }[];
};

export default function OtherDayCard({
  numOfEntries,
  date,
  entriesPerFeeling,
}: CardProps) {
  return (
    <article className="drop-shadow-2 rounded-lg bg-surface overflow-hidden">
      <CardHeader day={date} number={numOfEntries} />
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
  feeling,
  number,
}: {
  feeling: string;
  number: number;
}) {
  return (
    <div className="flex justify-between items-center ">
      <span className="text-sm font-bold">{feeling}</span>
      <span className="label-base">{number}</span>
    </div>
  );
}

function CardHeader({ day, number }: { day: string; number: number }) {
  return (
    <header className="px-4 pt-4 pb-1 flex items-center justify-between">
      <span className="title-base capitalize">{`${day} >`}</span>
      <span className="label-lg">{number}</span>
    </header>
  );
}
