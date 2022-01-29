import Image from 'next/image';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase-config';
import { useRouter } from 'next/router';
import Modal from './utils/Modal';

export default function SearchBar() {
  const router = useRouter();

  useEffect(() => {
    function redirectToSignIn() {
      if (!auth.currentUser) router.push('/');
    }
    redirectToSignIn();
  }, [auth, router]);

  return (
    <div className="w-full flex justify-around items-center py-2 pl-4 pr-2  rounded-full drop-shadow-3 bg-surface">
      <span className="material-icons">search</span>
      <input
        type="text"
        placeholder="look through your feelings"
        className="body-base grow text-center "
        disabled={true}
      />
      {auth?.currentUser?.photoURL && <ProfilePhoto user={auth.currentUser} />}
    </div>
  );
}

function ProfilePhoto({ user }) {
  const [logOut, setLogOut] = useState<boolean>();

  return (
    <div>
      <button onClick={() => setLogOut(true)}>
        <Image
          src={user?.photoURL}
          height={32}
          width={32}
          className="rounded-full"
        />
      </button>
      {logOut && (
        <Modal>
          {/* Overlay */}
          <div
            className="z-10 fixed inset-0 bg-darkTransparent"
            onClick={() => setLogOut(false)}
          />
          {/* Spacing*/}
          <div className="bg-surface z-20 fixed bottom-0  w-screen px-4 pt-6 pb-10 drop-shadow-5 flex flex-col items-center gap-4 rounded-t-3xl">
            <h3 className="title-lg opacity-75">You're leaving?</h3>
            <button
              className="w-full bg-black text-surface py-3 px-4 rounded-full drop-shadow-2 flex items-center justify-center gap-4
            hover:opacity-80 group transition-opacity"
              onClick={() => auth.signOut()}
            >
              <span className="material-icons text-xl opacity-50 group-hover:opacity-100  group-hover:translate-x-1 transition-all ">
                logout
              </span>
              <span className="label-xl">Yes, log out</span>
            </button>

            <button
              className="w-full bg-surface py-2 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
              hover:opacity-80 transition-opacity group      
              "
              onClick={() => setLogOut(false)}
            >
              <span className="material-icons text-xl opacity-50  group-hover:opacity-100 group-hover:scale-125 transition-all ease-in-out">
                close
              </span>
              <span className="label-xl">No, nevermind</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
