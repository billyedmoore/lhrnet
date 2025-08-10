import React from 'react';
import { type PredictionProps, PredictionComponent } from './PredictionComponent';


export const StatsForNerds: React.FC<PredictionProps> = ({ prediction }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4">
      <PredictionComponent prediction={prediction} />
      <div className="w-120 h-64 bg-gray-900 rounded-lg"></div>
      <div className="w-120 h-64 bg-gray-900 rounded-lg"></div>
      <div className="w-120 h-64 bg-gray-900 rounded-lg"></div>
      <div className="w-120 h-64 bg-gray-900 rounded-lg" ></div>
      <div className="w-120 h-64 bg-gray-900 rounded-lg"></div>
    </div>)

}
