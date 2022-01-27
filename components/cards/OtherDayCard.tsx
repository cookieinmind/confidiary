import React from 'react';

export default function OtherDayCard() {
  return (
    <article className="drop-shadow-2 rounded-lg bg-surface overflow-hidden">
      <CardHeader day="yesterday" number={16} />
      <div className="flex flex-col gap-4 p-4">
        <FeelingEntry feeling="happy" number={3} />
        <FeelingEntry feeling="happy" number={3} />
        <FeelingEntry feeling="happy" number={3} />
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
