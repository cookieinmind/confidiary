import React from 'react';
import NavItem from './NavItem';

export default function Navbar() {
  return (
    <div className="w-screen absolute bottom-0 flex items-center justify-between py-2 px-4 bg-black text-surface">
      <NavItem path="/days" label="days" icon="calendar_today" />
      <NavItem path="/insights" label="insights" icon="insights" />
      <CreateButton onClick={() => console.error('Redirect to create page')} />
      <NavItem path="/rankings" label="rankings" icon="star" />
      <NavItem path="/thoughts" label="thoughts" icon="bubble_chart" />
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
