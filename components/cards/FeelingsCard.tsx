import React, { useEffect, useState } from 'react';
import { Feeling } from '../utils/Models';
import { bgColorPicker, textColorPicker } from '../utils/ColorPicker';
import { useJournalContext } from '../../context/JournalContextProvider';

export default function FeelingCard({
  feeling,
  editFeeling,
}: {
  feeling: Feeling;
  editFeeling: () => void;
}) {
  const [show, setShow] = useState<boolean>(false);

  function manageExpand() {
    console.log('should show:', !show);
    setShow(!show);
  }

  const animationStyles = `transition-all duration-500 overflow-hidden ${
    show ? 'drop-shadow-2' : 'drop-shadow-1'
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
      {show && (
        <CardContent feeling={feeling} show={show} editFeeling={editFeeling} />
      )}
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
  const textColor = textColorPicker(feeling);

  const whenExpanded = expanded ? 'pb-2' : 'pb-5';

  return (
    <header
      className={`cursor-pointer relative pt-4 px-4 z-20 flex items-end justify-between ${textColor} bg-surface ${whenExpanded}`}
      onClick={onClick}
    >
      <div className="grow">
        <p className="body-base">
          <span className="font-bold">{feelingName}</span>
        </p>
      </div>
      <button className="shrink-0 grid place-items-center">
        <span
          className={`material-icons shrink-0 transition-all text-black ${
            expanded ? 'rotate-180' : 'rotate-0'
          }  `}
        >
          expand_more
        </span>
      </button>
    </header>
  );
}

function CardContent({
  feeling,
  show,
  editFeeling,
}: {
  feeling: Feeling;
  show: boolean;
  editFeeling: () => void;
}) {
  return (
    <div className=" drop-shadow-2 bg-surface z-10 relative">
      <div className="p-4 flex flex-col gap-2">
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
      <button
        className="p-4 bg-black text-surface w-full flex gap-4 justify-center items-center"
        onClick={editFeeling}
      >
        <span className="material-icons text-xl">edit</span>
        <span className="label-lg">Edit feeling</span>
      </button>
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
