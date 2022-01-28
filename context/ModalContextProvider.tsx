import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type ModalContextState = {
  isModalOn: boolean;
  setIsModalOn: (newVal: boolean) => void;
};

const modalContext = createContext<ModalContextState>({
  isModalOn: false,
  setIsModalOn: (newVal: boolean) => {},
});

export const useModalContext = () => {
  const response = useContext(modalContext);
  return response;
};

export default function ModalContextProvider({ children }) {
  const [isModalOn, setIsModalOn] = useState<boolean>(false);

  function proxy(newVal: boolean) {
    setIsModalOn(newVal);
  }

  const state = {
    isModalOn,
    setIsModalOn: proxy,
  };

  return (
    <modalContext.Provider value={state}>{children}</modalContext.Provider>
  );
}
