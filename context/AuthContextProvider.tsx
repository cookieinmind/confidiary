import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import { auth } from '../firebase/firebase-config';
import { onIdTokenChanged, User } from 'firebase/auth';

type IAuthContext = {
  user: User;
  isLoading: boolean;
};

const AuthContext = createContext<IAuthContext>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
