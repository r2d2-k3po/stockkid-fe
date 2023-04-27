import React from 'react';
import Panel from './Panel';

export default function VirtualScreen() {
  return (
    <div className="flex flex-wrap w-full">
      <Panel panelCode="panel0000" />
      <Panel panelCode="panel0001" />
      <Panel panelCode="panel0002" />
      <Panel panelCode="panel0003" />
    </div>
  );
}
