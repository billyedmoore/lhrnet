import React from "react";

interface StatBoxTitleProps {
  title: string
}

export const StatBoxTitle: React.FC<StatBoxTitleProps> = ({ title }) => { return <p className="font-mono">{title.toUpperCase()}</p> }

