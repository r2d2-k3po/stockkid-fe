import React from 'react';
import Panel from './Panel';

export default function VirtualScreen() {
  return (
    <div className="flex flex-wrap w-full">
      <Panel />
      <Panel />
      <Panel />
      <Panel />
    </div>
  );
}
