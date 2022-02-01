import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layouts/Layout';
import { useJournalContext } from '../context/JournalContextProvider';
import FeelingCard from '../components/cards/FeelingsCard';

export default function Feelings() {
  const { feelings } = useJournalContext();

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex w-full justify-between items-center px-2 opacity-50">
        <h6 className="title-base">Ordered by</h6>
        <h6 className="label-lg">A - Z</h6>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        {feelings &&
          feelings.map((f) => {
            return <FeelingCard feeling={f} />;
          })}
      </div>
    </div>
  );
}

Feelings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
