import React, {useMemo} from 'react';
import Panel from './Panel';
import {Params, useLoaderData} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import type {PanelMap} from '../../app/screenPanelMapSlice';

export const loader = ({params}: {params: Params}) => {
  return params.currentScreen as string;
};

export default function VirtualScreen() {
  const currentScreen = useLoaderData() as string;
  const uuid = parseInt(currentScreen) - 1;
  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const uuidPanelMap = useAppSelector(
    (state) => state.screenPanelMap.uuidPanelMap
  );

  const screenPanels = useMemo(() => {
    const panelArray: JSX.Element[] = [];
    if (uuidPanelMap.get(uuidList[uuid])) {
      for (const entry of (
        uuidPanelMap.get(uuidList[uuid]) as PanelMap
      ).entries()) {
        panelArray.push(
          <Panel key={entry[0]} panelCode={entry[1].panelCode} />
        );
      }
      return panelArray;
    }
    return false;
  }, [uuidPanelMap, uuidList, uuid]);

  return (
    <div className="flex flex-wrap w-full">
      <div>
        <p>screen: {currentScreen}</p>
        <p>uuid: {uuidList[parseInt(currentScreen) - 1]}</p>
      </div>
      {!!screenPanels && screenPanels}
    </div>
  );
}
