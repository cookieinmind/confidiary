import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from '../context/ModalContextProvider';

const serverSuggestions: string[] = [
  'mad',
  'angry',
  'happy',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
  'whatever',
];

export default function Create({ onClose }: { onClose: () => void }) {
  //*UI
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  //*Form
  const [feeling, setFeeling] = useState<string>(null);
  const [why, setWhy] = useState<string>(null);

  //*Effects
  useEffect(() => {
    setCanSubmit(
      feeling && feeling !== '' && serverSuggestions.includes(feeling)
    );
  }, [feeling, setCanSubmit]);

  //*Methods
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  function submit() {
    console.log({ feeling, why });
  }

  return (
    <Modal>
      {/* Overlay */}
      <div
        className="z-10 fixed inset-0 bg-darkTransparent"
        onClick={onClose}
      />

      {/* Spacing*/}
      <div className="z-20 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-screen px-2 ">
        {/* Container */}
        <form
          className="bg-surface text-onSurface rounded-xl drop-shadow-5 flex flex-col gap-8 py-8 px-4"
          onSubmit={handleFormSubmit}
        >
          {/* Feeling */}
          <InputWihtSuggestions
            data={serverSuggestions}
            setFeeling={setFeeling}
          />

          {/* What happened */}
          <TextArea setWhy={setWhy} />
          {/* Buttons */}
          <div className="flex gap-16 justify-center">
            <FormButton icon="close" onClick={onClose} color="text-error" />
            <FormButton icon="add" onClick={submit} active={canSubmit} />
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
  data,
  setFeeling,
}: {
  data: string[];
  setFeeling: (newVal: string) => void;
}) {
  const [filteredData, setFilteredData] = useState<string[]>();
  const inputRef = useRef<HTMLInputElement>();
  const [isTying, setIsTying] = useState<boolean>(false);

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    const typed = e.target.value;
    setFeeling(typed);
    if (typed === '') {
      setFilteredData(null);
      return;
    }
    const newFilter = data.filter((value) => {
      return value.includes(typed);
    });
    setFilteredData(newFilter);
  }

  function pickSuggestion(suggestion: string) {
    inputRef.current.value = suggestion;
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
          placeholder="anxious, proud, frustrated ..."
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
                <Suggestion text={value} key={i} onClick={pickSuggestion} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Suggestion({
  text,
  onClick,
}: {
  text: string;
  onClick: (newVal: string) => void;
}) {
  function handleClick(e) {
    e.preventDefault();
    onClick(text);
  }

  return (
    <button
      className="flex w-full justify-between items-center hover:bg-error p-4"
      onClick={handleClick}
    >
      <span className="label-lg capitalize">{text}</span>
      <span className="w-[20px] h-[20px] rounded-full bg-error" />
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

function Modal({ children, selector = '#portal' }) {
  const { setIsModalOn } = useModalContext();
  const [mounted, setMounted] = useState<boolean>();

  useEffect(() => {
    setMounted(true);
    setIsModalOn(true);
    return () => {
      setMounted(false);
      setIsModalOn(false);
    };
  }, [selector]);

  return mounted
    ? createPortal(children, document.querySelector(selector))
    : null;
}
