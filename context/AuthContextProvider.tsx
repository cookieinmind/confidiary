import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import {
  auth,
  signInWithGoogle as _signInWithGoogle,
} from '../firebase/firebase-config';
import { browserLocalPersistence, onIdTokenChanged, User } from 'firebase/auth';
import { StorageType } from '../components/utils/Models';

type IAuthContext = {
  user: User;
  isLoading: boolean;
  storageType: StorageType;
  changeStorageType: (x: StorageType) => void;
  logOut: () => void;
  signInWithGoogle: () => void;
  signInWithLocalStorage: () => void;
};

const LOCAL_STORAGE_KEY = 'SINNER_JOURNAL_session';

const AuthContext = createContext<IAuthContext>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [storageType, changeStorageType] = useState<StorageType>(
    StorageType.Undefined
  );

  function logOut() {
    switch (storageType) {
      case StorageType.Firebase:
        auth.signOut();
        changeStorageType(StorageType.Undefined);
        break;
      case StorageType.Local:
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(false));
        changeStorageType(StorageType.Undefined);
        break;
      default:
        throw new Error(
          "why are you loggin out if you haven't set the type of storage...?"
        );
    }
  }

  async function signInWithGoogle() {
    await _signInWithGoogle();
    auth.setPersistence(browserLocalPersistence);
    changeStorageType(StorageType.Firebase);
  }

  async function signInWithLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(true));
    changeStorageType(StorageType.Local);
  }

  useEffect(() => {
    setIsLoading(true);
    //option A, the user has a session
    onIdTokenChanged(auth, async (user: User) => {
      console.group('id token changed');
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '');
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, 'token', token, {});
      }
    });

    //option b, the user has a LS session
    const isLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (isLocal) {
      signInWithLocalStorage();
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        changeStorageType,
        storageType,
        logOut,
        signInWithGoogle,
        signInWithLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
