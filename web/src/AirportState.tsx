import React from 'react';

interface EmphTextProps {
  children: React.ReactNode
}

const EmphText: React.FC<EmphTextProps> = ({ children }) => {
  return (<p className="font-mono text-6xl" >{children}</p>)
}

interface AirportStateProps {
}

const AirportState: React.FC<AirportStateProps> = () => {
  return (
    <div className="grid text-4xl grid-rows-3">
      <div className="flex space-x-2 items-center justify-center"><p>Direction is </p><EmphText>WESTERLY</EmphText></div>
      <div className="flex space-x-2 items-center justify-center"><p>Landing on </p><EmphText>NORTH</EmphText><p> runway</p></div>
      <div className="flex space-x-2 items-center justify-center"><p>Taking off from </p><EmphText>SOUTH</EmphText><p> runway</p></div>
    </div>
  );
};

export default AirportState;
