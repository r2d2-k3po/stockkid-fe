import React from 'react';
import Panel from './Panel';
import {Params, useLoaderData} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import MapJSONTest from '../../tests/MapJSONTest';

export const loader = ({params}: {params: Params}) => {
  return params.currentScreen as string;
};

export default function VirtualScreen() {
  const currentScreen = useLoaderData() as string;
  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);

  return (
    <div className="flex flex-wrap w-full">
      <p>screen: {currentScreen}</p>
      <p>uuid: {uuidList[parseInt(currentScreen) - 1]}</p>
      <Panel panelCode="panel0000" />
      <Panel panelCode="panel0001" />
      <Panel panelCode="panel0002" />
      <Panel panelCode="panel0003" />
      <Panel panelCode="panel0004" />
      <Panel panelCode="panel0005" />
      <Panel panelCode="panel0006" />
      <Panel panelCode="panel0007" />
    </div>
  );
}
