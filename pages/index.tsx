import Image from 'next/image';
import { auth, signInWithGoogle } from '../firebase/firebase-config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { useJournalContext } from '../context/JournalContextProvider';
import { StorageType } from '../components/utils/Models';

export default function Home() {
  const router = useRouter();
  const { changeStorageType, storageType } = useJournalContext();

  useEffect(() => {
    if (storageType === StorageType.Firebase && auth.currentUser) {
      console.log('w google');
      inWithGoogle();
    } else if (storageType === StorageType.Local) {
      console.log('w ls');
      inWithLocalStorage();
    } else {
      console.log('no storage type set');
    }

    auth.onAuthStateChanged((user) => {
      console.log('-------->', user);
    });
    //   if (auth.currentUser) {
    //     //The user prob wants to use the firebase version
    //     changeStorageType(StorageType.Firebase);
    //     inWithGoogle();
    //   }

    // console.log('is the user defined:', auth);
    // if (storageType === StorageType.Firebase) {
    //   auth.setPersistence(browserLocalPersistence);
    //   onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       inWithGoogle();
    //     }
    //   });
    // }
  }, []);

  function goHome() {
    router.push('/home');
  }

  async function manageSignInWihtGoogle() {
    await signInWithGoogle();
    inWithGoogle();
  }

  function inWithGoogle() {
    if (auth.currentUser) {
      auth.setPersistence(browserLocalPersistence);
      changeStorageType(StorageType.Firebase);
      goHome();
    }
  }

  async function inWithLocalStorage() {
    changeStorageType(StorageType.Local);
    goHome();
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <main className="flex flex-col gap-8">
        <div>
          <h1 className="headline-lg">
            sinner
            <br />
            journal
          </h1>
          <p className="body-lg opacity-50">your personal journal</p>
        </div>
        <div className="flex flex-col gap-2">
          <SignInWithGoogleButton openPopUp={manageSignInWihtGoogle} />
          <span className="label-lg py-2">{`--- or ---`}</span>
          <SignInWithLocalStorageButton
            onLocalStorageSelected={inWithLocalStorage}
          />
        </div>
      </main>

      <footer className="absolute bottom-10">
        <a
          href="https://github.com/juanc212/sinner-journal"
          target="_black"
          className="group flex gap-1 items-center"
        >
          <span className="group-hover:underline">about</span>
          <span className="transition-transform group-hover:translate-x-1">
            {'>'}
          </span>
        </a>
      </footer>
    </div>
  );
}

export function SignInWithGoogleButton({
  openPopUp,
}: {
  openPopUp: () => Promise<void>;
}) {
  return (
    <button
      onClick={openPopUp}
      className="rounded-md py-4  pr-8 pl-4 text-xl w-fit border-onSurface border-2 flex items-center  gap-4"
    >
      <figure className="aspect-square h-[16px] center">
        <Image src="/google-logo.svg" height={16} width={16} />
      </figure>
      <span className="label-lg">Sign in with Google</span>
    </button>
  );
}

function SignInWithLocalStorageButton({
  onLocalStorageSelected,
}: {
  onLocalStorageSelected: () => Promise<void>;
}) {
  return (
    <button
      onClick={onLocalStorageSelected}
      className="bg-blue-500 text-white rounded-md py-4  pr-8 pl-4  text-xl w-fit border-onSurface border-2 flex items-center  gap-4"
    >
      <span className="material-icons text-[16px]">lock</span>
      <span className="label-lg">Keep journal on your phone</span>
    </button>
  );
}
