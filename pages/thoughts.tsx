import React from 'react';
import Layout from '../components/Layouts/Layout';
import ThoughtCard from '../components/cards/ThoughtCard';

const dummyContent = {
  day: '22/20/2022',
  created: 'at 2pm',
  why: 'IDK',
  feeling: 'happy',
};

export default function Thoughts() {
  return (
    <div>
      <div className="flex flex-col p-2 gap-4 h-screen">
        <ThoughtCard thought={dummyContent} />
        <ThoughtCard thought={dummyContent} />
        <ThoughtCard thought={dummyContent} />
        <ThoughtCard thought={dummyContent} />
      </div>
    </div>
  );
}

Thoughts.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
