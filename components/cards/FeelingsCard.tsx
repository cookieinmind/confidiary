import React, { useEffect, useState } from 'react';
import { Feeling } from '../utils/Models';
import { bgColorPicker, textColorPicker } from '../utils/ColorPicker';
import { useJournalContext } from '../../context/JournalContextProvider';

export default function FeelingCard({ feeling }: { feeling: Feeling }) {
  const [show, setShow] = useState<boolean>(false);

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
      ${animationStyles}      
      `}
    >
      <CardHeader
        feelingName={feeling.name}
        onClick={manageExpand}
        expanded={show}
      />
      {show && <CardContent feeling={feeling} show={show} />}
    </article>
  );
}

function CardHeader({
  feelingName,
  onClick,
  expanded,
}: {
  feelingName: string;
  onClick: () => void;
  expanded: boolean;
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
        <p className="body-base">
          <span className="font-bold">{feelingName}</span>
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

function CardContent({ feeling, show }: { feeling: Feeling; show: boolean }) {
  const flex_behaviour = `transition-[opacity] duration-500 ease-in-out ${
    show ? 'opactiy-100' : 'opactiy-0'
  }`;

  return (
    <div
      id="content1!!"
      className={`bg-surface p-4 z-10 drop-shadow-2 relative      
    ${flex_behaviour}
    `}
    >
      {feeling &&
        Object.keys(feeling.values).map((attribute) => {
          return (
            <FeelingEntry
              key={attribute}
              attribute={attribute}
              number={feeling.values[attribute]}
            />
          );
        })}
    </div>
  );
}

function FeelingEntry({
  attribute,
  number,
}: {
  attribute: string;
  number: number;
}) {
  const { findFeeling } = useJournalContext();
  const feeling = findFeeling(attribute);
  const textColor = textColorPicker(feeling);

  return (
    <div className="flex justify-between items-center ">
      <span className={`text-sm font-bold ${textColor}`}>{attribute}</span>
      <span className={`label-base`}>{number}</span>
    </div>
  );
}
