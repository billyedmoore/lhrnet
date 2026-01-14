import React from 'react';
import { useEffect, useState } from 'react';
import { StatBoxTitle } from './StatBoxTitle';
import type { StatsForNerdsElemProps } from './StatsForNerds';
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
  '#C69EC7', '#805D97', '#B86FA3', '#FF9494', '#FF6E82', '#D7C8A9', '#83B8C1',
  '#9DC7B5', '#FFBB98', '#FF8F87', '#FFB4C8', '#FF8E8E', '#8FB1C0', '#9C84B7'
];


interface PieInputInterface {
  country: string
  count: number
  // Index signature to make this type compatible with Record<string, unknown>
  [key: string]: unknown;
}

export const OriginPie: React.FC<StatsForNerdsElemProps> = ({ aircraftStates }) => {
  const [showLegend, setShowLegend] = useState(true);

  const handleResize = () => {
    // Only show legend on wide devices
    setShowLegend(window.innerWidth >= 800);
  };

  useEffect(() => {
    handleResize()

    window.addEventListener("resize", handleResize);

    // return a cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          {showLegend && <Legend iconType='diamond' />}
        </PieChart>
      </ResponsiveContainer>
    </>)
}
