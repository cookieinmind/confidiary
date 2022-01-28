import React from 'react';

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

function CardHeader({ number }: { number: number }) {
  return (
    <header className="p-4 flex items-center justify-between bg-black text-surface">
      <span className="title-base">{'Today >'}</span>
      <span className="label-lg">{number}</span>
    </header>
  );
}
