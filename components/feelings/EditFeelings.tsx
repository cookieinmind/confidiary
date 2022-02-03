import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useJournalContext } from '../../context/JournalContextProvider';
import { RouterPaths } from '../../context/RouterPaths';
import { bgColorPicker, textColorPicker } from '../utils/ColorPicker';
import Modal from '../utils/Modal';
import { Feeling } from '../utils/Models';

export default function EditFeeling({
  feeling,
  onClose,
}: {
  feeling: Feeling;
  onClose: () => void;
}) {
  //*Context

  //*UI
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const router = useRouter();

  //*Form
  const [why, setWhy] = useState<string>(null);

  //*Effects
  useEffect(() => {}, [feeling, setCanSubmit]);

  //*Methods
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  async function submit() {   
    router.push(RouterPaths.entries);
    onClose();
  }

  const bgColor = bgColorPicker(feeling);

  return (
    <Modal>
      {/* Overlay */}
      <div
        className="z-10 fixed inset-0 bg-darkTransparent"
        onClick={onClose}
      />

      {/* Spacing*/}
      <div className="z-20 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-screen px-2 ">
        {/* Container */}
        <form
          className="bg-surface z-0 
      relative rounded-lg overflow-hidden drop-shadow-5"
          onSubmit={handleFormSubmit}
        >
          {/* Header */}
          <div className={`${bgColor} text-surface relative z-20 p-4 pb-5  `}>
            <div className="grow">
              <p className="body-base">
                <span className="">editing </span>
                <span className="text-black">{feeling.name}</span>
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 drop-shadow-2 bg-surface z-10 relative p-4 drop-shadow-1 mb-0">
            {feeling &&
              Object.keys(feeling.values).map((attribute) => {
                return (
                  <AttributeEntry
                    key={attribute}
                    attribute={attribute}
                    number={feeling.values[attribute]}
                  />
                );
              })}
          </div>

          {/* Submit section */}
          <div className="p-4 bg-black text-surface opacity-50">
            <div className="flex w-full justify-between items-centers mb-2 ">
              <p className="body-base text-center w-full">
                currently in development
              </p>
              {/* <span className="label-lg font-bold opacity-50">total</span>
              <span className="text-success label-lg font-bold">100%!!!</span> */}
            </div>
            {/* <div className="flex gap-16 justify-center ">
              <FormButton
                icon="close"
                onClick={onClose}
                color="text-errorContainer"
              />
              <FormButton icon="save" onClick={submit} active={canSubmit} />
            </div> */}
          </div>
        </form>
      </div>
    </Modal>
  );
}

function AttributeEntry({
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
      <input
        type="text"
        placeholder={number.toString()}
        className={`label-base p-0 w-fit border-0 text-right`}
      />
    </div>
  );
}

function FormButton({
  icon,
  onClick,
  color = 'text-onSurface',
  active = true,
}: {
  color?: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
}) {
  const iconStyle = 'material-icons text-2xl font-medium ' + color;
  return (
    <button
      onClick={onClick}
      className="bg-surface p-4 drop-shadow-1 rounded-xl disabled:opacity-50 disabled:bg-disabled disabled:text-onDisabled 
      disabled:drop-shadow-0 
      aspect-square center
      
      "
      disabled={!active}
    >
      <span className={iconStyle}>{icon}</span>
    </button>
  );
}
