import React from 'react';
import Chip from './Chip';

export default function Chipnav({ options }: { options: string[] }) {
  return (
    <div className="flex overflow-x-auto gap-2 no-scrollbar snap-x">
      {options.map((opt, i) => {
        return (
          <div className="snap-start" key={i}>
            <Chip text={opt} onClick={() => console.log('clicked ' + opt)} />
          </div>
        );
      })}
    </div>
  );
}
