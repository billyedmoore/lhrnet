import { type OpenSkyStates } from '../open-sky';
import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  LabelList,
  Legend
} from 'recharts';

// GTP Generated colours
const COLOUR = [
  '#E0BBE4', '#957DAD', '#D291BC', '#FFC7C7', '#FF94A2', '#F0EAD6', '#A0D2DB',
  '#B5EAD7', '#FFDAC1', '#FFB7B2', '#FFD1DC', '#FFADAD', '#AEC6CF', '#B399D3'
];

import { StatBoxTitle } from './StatBoxTitle';

interface OriginPieProps {
  aircraftStates: OpenSkyStates
}

interface PieInputInterface {
  country: string
  count: number
}

export const OriginPie: React.FC<OriginPieProps> = ({ aircraftStates }) => {

  const contriesMap = aircraftStates.states.reduce((countriesMap, state) => {
    if (countriesMap.has(state.origin_country)) {
      countriesMap.set(state.origin_country, countriesMap.get(state.origin_country)! + 1);
    } else {
      countriesMap.set(state.origin_country, 1)
    }

    return countriesMap
  }, new Map<string, number>)

  const pieInput: PieInputInterface[] = []
  contriesMap.forEach((count, country) => { pieInput.push({ country, count }) })

  return (
    <>
      <StatBoxTitle title="AIRCRAFT-COUNTRIES-OF-REGISTRATION" />
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{
            top: 15,
            right: 15,
            bottom: 15,
            left: 15,
          }}
        >
          <Pie
            data={pieInput}
            dataKey="count"
            nameKey="country"
            fill="#8884d8"
          >
            {pieInput.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLOUR[index % COLOUR.length]} />
            ))}
            <LabelList dataKey="name" position="insideTop" />
          </Pie>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend iconType='diamond' />
        </PieChart>
      </ResponsiveContainer>
    </>)
}
