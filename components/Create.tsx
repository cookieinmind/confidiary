import React, { useEffect, useRef, useState } from 'react';
import { useJournalContext } from '../context/JournalContextProvider';
import { Feeling, JournalEntry } from './utils/Models';
import { auth } from '../firebase/firebase-config';
import { useRouter } from 'next/router';
import Modal from './utils/Modal';
import { bgColorPicker } from './utils/ColorPicker';
import { DateTime } from 'luxon';

export default function Create({ onClose }: { onClose: () => void }) {
  //*Context
  const { createEntry, feelings } = useJournalContext();

  //*UI
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const router = useRouter();

  //*Form
  const [feeling, setFeeling] = useState<Feeling>(null);
  const [why, setWhy] = useState<string>(null);

  //*Effects
  useEffect(() => {
    setCanSubmit(feeling && feelings.includes(feeling));
  }, [feeling, setCanSubmit]);

  //*Methods
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  async function submit() {
    console.log('called submit');
    const data: JournalEntry = {
      date: DateTime.now().toISO(),
      feelingName: feeling.name,
      uid: auth?.currentUser?.uid,
      why: why,
    };
    createEntry(data);
    router.push('/entries');
    onClose();
  }

  return (
    <Modal>
      {/* Overlay */}
      <div
        className="z-10 fixed inset-0 bg-darkTransparent"
        onClick={onClose}
      />

      {/* Spacing*/}
      <div className="z-20 fixed top-10 left-1/2  translate-x-[-50%] w-screen px-2 ">
        {/* Container */}
        <form
          className="bg-surface text-onSurface rounded-xl drop-shadow-5 flex flex-col gap-8 py-8 px-4"
          onSubmit={handleFormSubmit}
        >
          {/* Feeling */}
          <InputWihtSuggestions
            suggestedFeelings={feelings}
            setFeeling={setFeeling}
          />

          {/* What happened */}
          <TextArea setWhy={setWhy} />
          {/* Buttons */}
          <div className="flex gap-16 justify-center ">
            <FormButton
              icon="close"
              onClick={onClose}
              color="text-errorContainer"
            />
            <FormButton icon="save" onClick={submit} active={canSubmit} />
          </div>
        </form>
      </div>
    </Modal>
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

function InputWihtSuggestions({
  suggestedFeelings,
  setFeeling,
}: {
  suggestedFeelings: Feeling[];
  setFeeling: (newVal: Feeling) => void;
}) {
  const [filteredData, setFilteredData] = useState<Feeling[]>();
  const inputRef = useRef<HTMLInputElement>();
  const [isTying, setIsTying] = useState<boolean>(false);

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    const typed = e.target.value;
    // setFeeling(typed);
    if (typed === '') {
      //the user deleted the input
      setFilteredData(null);
      return;
    }
    const newFilter = suggestedFeelings.filter((value) => {
      return value.name.includes(typed.toLowerCase());
    });
    setFilteredData(newFilter);
  }

  function pickSuggestion(suggestion: Feeling) {
    inputRef.current.value = suggestion.name;
    setFilteredData(null);
    setFeeling(suggestion);
  }

  return (
    <div className="relative z-0 flex flex-col gap-4">
      <label htmlFor="feeling" className="flex items-center gap-2">
        <span className="material-icons">bubble_chart</span>
        <span className="title-sm opacity-70">
          In one word, how are you feeling
        </span>
      </label>
      <div
        className={`relative z-10 rounded-xl  w-full ${
          isTying ? 'overflow-hidden drop-shadow-1' : ''
        }`}
      >
        {/* Input */}
        <input
          type="text"
          ref={inputRef}
          name="feeling"
          className={`w-full p-4 ${
            isTying ? '' : 'border-outline border-2 rounded-xl'
          }`}
          placeholder="amusement, joy, stressed..."
          onChange={handleTyping}
          autoComplete="off"
          onBlur={() => setIsTying(false)}
          onFocus={() => setIsTying(true)}
        />
        {/* Suggestions here */}
        {filteredData?.length > 0 && (
          <div className="flex flex-col bg-black text-surface w-full max-h-[13rem] overflow-y-auto">
            {filteredData.map((value, i) => {
              return (
                <Suggestion feeling={value} key={i} onClick={pickSuggestion} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Suggestion({
  feeling,
  onClick,
}: {
  feeling: Feeling;
  onClick: (newVal: Feeling) => void;
}) {
  function handleClick(e) {
    e.preventDefault();
    onClick(feeling);
  }

  const bgColor = bgColorPicker(feeling);

  return (
    <button
      className="flex w-full justify-between items-center hover:bg-error p-4"
      onClick={handleClick}
    >
      <span className="label-lg capitalize">{feeling.name}</span>
      <span className={`w-[20px] h-[20px] rounded-full ${bgColor}`} />
    </button>
  );
}

function TextArea({ setWhy }: { setWhy: (s: string) => void }) {
  const [isTying, setIsTying] = useState<boolean>(false);

  function handleTyping(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const typed = e.target.value;
    setWhy(typed);
  }
  return (
    <div className="relative z-0 flex flex-col gap-4">
      <label htmlFor="why" className="flex items-center gap-2">
        <span className="material-icons">edit</span>
        <span className="title-sm opacity-70">What happened?</span>
      </label>
      <div
        className={`relative z-10 rounded-xl  w-full ${
          isTying ? 'overflow-hidden drop-shadow-1' : ''
        }`}
      >
        <textarea
          // ref={inputRef}
          name="why"
          className={`body-sm w-full h-[150px] p-4 ${
            isTying ? '' : 'border-outline border-2 rounded-xl'
          }
            [resize:none]
            `}
          placeholder="anxious, proud, frustrated ..."
          onChange={handleTyping}
          autoComplete="off"
          onBlur={() => setIsTying(false)}
          onFocus={() => setIsTying(true)}
        />
      </div>
    </div>
  );
}
