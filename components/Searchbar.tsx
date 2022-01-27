import Image from 'next/image';
import { auth } from '../firebase/firebase-config';

export default function SearchBar() {
  return (
    <div className="w-full flex justify-around items-center py-2 pl-4 pr-2  rounded-full drop-shadow-3">
      <span className="material-icons">search</span>
      <input
        type="text"
        placeholder="look through your feelings"
        className="body-base grow text-center"
      />
      {auth.currentUser.photoURL && (
        <Image
          src={auth?.currentUser?.photoURL}
          height={32}
          width={32}
          className="rounded-full"
        />
      )}
    </div>
  );
}
