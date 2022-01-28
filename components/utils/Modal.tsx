import React from 'react';
import { useModalContext } from '../../context/ModalContextProvider';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function Modal({ children, selector = '#portal' }) {
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
