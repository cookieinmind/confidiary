import { User } from 'firebase/auth';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '../context/AuthContextProvider';
import Modal from './utils/Modal';
import { StorageType } from './utils/Models';

export default function SearchBar() {
  const { storageType, logOut, user } = useAuth();

  return (
    <div className="w-full flex justify-around items-center py-2 pl-4 pr-2  rounded-full drop-shadow-3 bg-surface">
      <span className="material-icons">search</span>
      <input
        placeholder="look through your feelings"
        className="body-base grow text-center "
        disabled={true}
      />
      {user?.photoURL && <ProfilePhoto user={user} logOut={logOut} />}
      {storageType === StorageType.Local && (
        <LocaleStorageButton logOut={logOut} />
      )}
    </div>
  );
}

function LocaleStorageButton({ logOut }: { logOut: () => void }) {
  const [openModal, setOpenModal] = useState<boolean>();
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  function ManageLogOut() {
    setOpenModal(false);
    logOut();
  }

  return (
    <div>
      <button
        className="h-[32px] w-[32px] rounded-full bg-black center"
        onClick={() => setOpenModal(true)}
      >
        <span className="material-icons text-surface text-base">wifi_lock</span>
      </button>
      {openModal && (
        <Modal>
          {/* Overlay */}
          <div
            className="z-10 fixed inset-0 bg-darkTransparent"
            onClick={() => setOpenModal(false)}
          />
          {/* Spacing*/}
          <div className="bg-surface z-20 fixed bottom-0  w-screen px-4 pt-6 pb-10 drop-shadow-5 flex flex-col items-center gap-4 rounded-t-3xl">
            <h3 className="haedline-base font-bold opacity-75 text-center">
              To access sync between between devices and more features you must
              be logged in
            </h3>

            <button
              // onClick={openPopUp}
              className="w-full bg-surface py-4 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
                 group transition-all hover:drop-shadow-3"
              onClick={() => {
                setOpenModal(false);
                setShowErrorModal(true);
              }}
            >
              <figure className="aspect-square h-[16px] center group-hover:scale-125 transition-all">
                <Image src="/google-logo.svg" height={16} width={16} />
              </figure>
              <span className="label-xl">Sync account with Google</span>
            </button>

            {/* <button
              className="w-full bg-black text-surface py-3 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
                group transition-all hover:drop-shadow-3
                "
              onClick={() => setOpenModal(false)}
            >
              <span className="material-icons text-xl opacity-50  group-hover:opacity-100 group-hover:scale-125 transition-all ease-in-out">
                close
              </span>
              <span className="label-xl">No, stay in local storage</span>
            </button> */}

            <button
              className="w-full bg-black text-surface py-3 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
                group transition-all hover:drop-shadow-3
                "
              onClick={ManageLogOut}
            >
              <span className="material-icons text-xl opacity-50  group-hover:opacity-100 group-hover:scale-125 transition-all ease-in-out">
                logout
              </span>
              <span className="label-xl">Log out</span>
            </button>
          </div>
        </Modal>
      )}

      {showErrorModal && (
        <Modal>
          {/* Overlay */}
          <div
            className="z-10 fixed inset-0 bg-darkTransparent"
            onClick={() => setOpenModal(false)}
          />
          {/* Spacing*/}
          <div className="fixed top-40 z-20 px-2">
            <article
              id="findme"
              className="bg-surface              
              drop-shadow-5 rounded-lg overflow-hidden w-full
              "
            >
              <header className="p-4 center flex-col bg-black text-surface">
                {/* <span className="material-icons text-6xl opacity-50 mb-4">
                  engineering
                </span> */}
                <div className="flex items-center gap-4">
                  <span className="material-icons text-2xl opacity-90">
                    wifi_lock
                  </span>
                  <span className="material-icons text-2xl opacity-50">
                    double_arrow
                  </span>
                  <figure className="aspect-square h-[24px] center group-hover:scale-125 transition-all">
                    <Image src="/google-logo.svg" height={24} width={24} />
                  </figure>
                </div>
              </header>
              <div className="flex flex-col gap-4 p-4 items-center">
                <p className="title-lg text-center">
                  Export from local storage to full account is currently under
                  development. We sorry for the inconveniences.
                </p>

                <button
                  className="w-full bg-surface text-onSurface py-3 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
                group transition-all hover:drop-shadow-3
                "
                  onClick={() => setShowErrorModal(false)}
                >
                  <span className="label-xl">Go back</span>
                </button>
              </div>
            </article>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProfilePhoto({ user, logOut }: { user: User; logOut: () => void }) {
  const [showModal, setShowModal] = useState<boolean>();

  function ManageLogOut() {
    setShowModal(false);
    logOut();
  }

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="center">
        <Image
          src={user?.photoURL}
          height={32}
          width={32}
          className="rounded-full"
        />
      </button>
      {showModal && (
        <Modal>
          {/* Overlay */}
          <div
            className="z-10 fixed inset-0 bg-darkTransparent"
            onClick={() => setShowModal(false)}
          />
          {/* Spacing*/}
          <div className="bg-surface z-20 fixed bottom-0  w-screen px-4 pt-6 pb-10 drop-shadow-5 flex flex-col items-center gap-4 rounded-t-3xl">
            <h3 className="title-lg opacity-75">You're leaving?</h3>
            <button
              className="w-full bg-black text-surface py-3 px-4 rounded-full drop-shadow-2 flex items-center justify-center gap-4
            group transition-all hover:drop-shadow-3"
              onClick={ManageLogOut}
            >
              <span className="material-icons text-xl opacity-50 group-hover:opacity-100  group-hover:translate-x-1 transition-all ">
                logout
              </span>
              <span className="label-xl">Yes, log out</span>
            </button>

            <button
              className="w-full bg-surface py-2 px-4 rounded-full drop-shadow-1 flex items-center justify-center gap-4
              group transition-all hover:drop-shadow-3 
              "
              onClick={() => setShowModal(false)}
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
