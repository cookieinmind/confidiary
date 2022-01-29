import React, { useState } from 'react';
import NavItem from './NavItem';
import Create from '../Create';

export default function Navbar() {
  const [showCreate, setShowCreate] = useState<boolean>(false);

  function manageCreation() {
    setShowCreate(true);
  }

  return (
    <div className="w-full flex items-center justify-between py-2 px-4 bg-black text-surface">
      <NavItem path="/home" label="days" icon="calendar_today" />
      <NavItem path="/insights" label="insights" icon="insights" />
      <CreateButton onClick={manageCreation} />
      <NavItem path="/rankings" label="rankings" icon="star" />
      <NavItem path="/entries" label="entries" icon="bubble_chart" />

      {showCreate && <Create onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export function CreateButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="bg-surface text-onSurface drop-shadow-3 rounded-xl p-2 grid place-items-center"
      onClick={onClick}
    >
      <span className="material-icons text-[32px]">add</span>
    </button>
  );
}
