import React, { useEffect } from 'react';
import OtherDayCard from '../components/cards/OtherDayCard';
import TodayCard from '../components/cards/TodayCard';
import Chipnav from '../components/ChipsNav';
import Layout from '../components/Layouts/Layout';
import { auth } from '../firebase/firebase-config';

const options = [
  'anxious',
  'proud',
  'amused',
  'offended',
  'spiteful',
  'revulsion',
  'bitter',
  'frustrated',
];

export default function Days() {
  return (
    <div>
      <div className="flex flex-col p-2 gap-4">
        {/* <Chipnav options={options} /> */}
        <TodayCard />
        <TodayCard />
        <TodayCard />
        <TodayCard />
        <TodayCard />
        <TodayCard />
        <OtherDayCard />
      </div>
    </div>
  );
}

Days.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
