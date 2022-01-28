import React, { useState } from 'react';
import { JournalEntry } from '../../models/Models';

const dummyText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export default function ThoughtCard({ entry }: { entry: JournalEntry }) {
  const [show, setShow] = useState<boolean>(true);

  function manageExpand() {
    console.log('should show:', !show);
    setShow(!show);
  }

  const animationStyles = `transition-all duration-500 overflow-hidden ${
    show ? 'drop-shadow-2 h-fit' : 'drop-shadow-1 h-[73.5px]'
  }`;

  return (
    <article
      className={`bg-surface z-0 
      relative rounded-lg flex flex-col
      h-full
      ${animationStyles}      
      `}
    >
      <CardHeader
        feeling={entry.feelingName}
        time={entry.date.getHours().toString()}
        onClick={manageExpand}
        expanded={show}
      />
      <CardContent content={entry.why} show={show} />
    </article>
  );
}

function CardContent({ content, show }: { content: string; show: boolean }) {
  const flex_behaviour = `transition-[opacity] duration-500 ease-in-out ${
    show ? 'opactiy-100' : 'opactiy-0'
  }`;

  return (
    <main
      className={`bg-surface p-4 z-10 drop-shadow-2 relative      
    ${flex_behaviour}
    `}
    >
      <p className="body-base">{content}</p>
    </main>
  );
}

function CardHeader({
  time,
  feeling,
  onClick,
  expanded,
}: {
  time: string;
  feeling: string;
  onClick: () => void;
  expanded: boolean;
}) {
  const flex_behaviour = `basis-auto shrink-0 grow-0}`;

  return (
    <header
      className={`cursor-pointer relative z-20 p-4 flex items-end justify-between bg-[#FF5959] text-surface ${flex_behaviour}`}
      onClick={onClick}
    >
      <div className="grow">
        <span className="label-base opacity-50 lowercase">at {time}</span>
        <p className="body-base">
          you were feeling{' '}
          <span className="font-bold text-onSurface">{feeling}</span>
        </p>
      </div>
      <button className="shrink-0 grid place-items-center">
        <span
          className={`material-icons shrink-0 transition-all ${
            expanded ? 'rotate-180' : 'rotate-0'
          }  `}
        >
          expand_more
        </span>
      </button>
    </header>
  );
}
