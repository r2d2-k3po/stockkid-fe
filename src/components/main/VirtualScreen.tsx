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

  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const uuidPanelMap = useAppSelector(
    (state) => state.screenPanelMap.uuidPanelMap
  );

  const uuid = uuidList[parseInt(currentScreen) - 1];

  const screenPanels = useMemo(() => {
    const panelArray: JSX.Element[] = [];
    if (uuidPanelMap.get(uuid)) {
      for (const entry of (uuidPanelMap.get(uuid) as PanelMap).entries()) {
        panelArray.push(
          <Panel
            key={entry[0]}
            uuid={uuid}
            uuidP={entry[0]}
            panelType={entry[1]}
          />
        );
      }
      return panelArray;
    }
    return false;
  }, [uuidPanelMap, uuid]);

  return (
    <div className="flex flex-wrap w-full">
      <div>
        <p>screen: {currentScreen}</p>
        <p>uuid: {uuid}</p>
      </div>
      {!!screenPanels && screenPanels}
    </div>
  );
}
