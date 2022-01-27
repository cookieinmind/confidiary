import React from 'react';

export default function Chip({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      className="py-[5px] px-4 rounded-full w-fit border-outline border-[1px]"
      onClick={onClick}
    >
      <span className="label-base">{text}</span>
    </button>
  );
}
