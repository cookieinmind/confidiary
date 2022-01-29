import React, { useState } from 'react';
import { JournalEntry } from '../utils/Models';
import { bgColorPicker } from '../utils/ColorPicker';
import { useJournalContext } from '../../context/JournalContextProvider';

export default function EntryCard({ entry }: { entry: JournalEntry }) {
  const [show, setShow] = useState<boolean>(false);

  function manageExpand() {
    console.log('should show:', !show);
    setShow(!show);
  }

  const animationStyles = `transition-all duration-500 overflow-hidden ${
    show ? 'drop-shadow-2 h-fit' : 'drop-shadow-1 h-[73.5px]'
  }`;

  const time =
    entry.date.toDate().getHours().toString() +
    ':' +
    (entry.date.toDate().getMinutes() < 10
      ? '0' + entry.date.toDate().getMinutes().toString()
      : entry.date.toDate().getMinutes().toString());

  return (
    <article
      className={`bg-surface z-0 
      relative rounded-lg flex flex-col
      ${animationStyles}      
      `}
    >
      <CardHeader
        feelingName={entry.feelingName}
        time={time}
        onClick={manageExpand}
        expanded={show}
        showArrow={entry.why !== null}
      />
      {entry.why && <CardContent content={entry.why} show={show} />}
    </article>
  );
}

function CardContent({ content, show }: { content: string; show: boolean }) {
  const flex_behaviour = `transition-[opacity] duration-500 ease-in-out ${
    show ? 'opactiy-100' : 'opactiy-0'
  }`;

  return (
    <div
      className={`bg-surface p-4 z-10 drop-shadow-2 relative      
    ${flex_behaviour}
    `}
    >
      <p className="body-base">{content}</p>
    </div>
  );
}

function CardHeader({
  time,
  feelingName,
  onClick,
  expanded,
  showArrow,
}: {
  time: string;
  feelingName: string;
  onClick: () => void;
  expanded: boolean;
  showArrow: boolean;
}) {
  const { findFeeling } = useJournalContext();
  const feeling = findFeeling(feelingName);
  const bgColor = bgColorPicker(feeling);

  const flex_behaviour = `basis-auto shrink-0 grow-0}`;

  return (
    <header
      className={`cursor-pointer relative z-20 p-4 flex items-end justify-between ${bgColor}  text-surface ${flex_behaviour}`}
      onClick={onClick}
    >
      <div className="grow">
        <span className="label-base opacity-70 lowercase mt-1">at {time}</span>
        <p className="body-base">
          you were feeling{' '}
          <span className="font-bold text-onSurface">{feelingName}</span>
        </p>
      </div>
      {showArrow && (
        <button className="shrink-0 grid place-items-center">
          <span
            className={`material-icons shrink-0 transition-all ${
              expanded ? 'rotate-180' : 'rotate-0'
            }  `}
          >
            expand_more
          </span>
        </button>
      )}
    </header>
  );
}
