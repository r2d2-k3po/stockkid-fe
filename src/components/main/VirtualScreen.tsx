import React, {useMemo} from 'react';
import Panel from './Panel';
import {Params, useLoaderData} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import type {PanelMap} from '../../app/screenPanelMapSlice';
import GridLayout, {Responsive, WidthProvider} from 'react-grid-layout';
import {MaterialSymbol} from 'react-material-symbols';

export const loader = ({params}: {params: Params}) => {
  return params.currentScreen as string;
};

export default function VirtualScreen() {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

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
            data-grid={{x: 2, y: 2, w: 3, h: 2}}
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
    <GridLayout
      className="layout"
      cols={12}
      rowHeight={80}
      width={1536}
      autoSize={true}
      draggableHandle=".drag_pan"
      margin={[2, 2]}
      // onLayoutChange={}
    >
      <div
        key={uuid}
        data-grid={{x: 0, y: 0, w: 3, h: 1}}
        className="border-2 border-info rounded-md hover:border-accent"
      >
        <MaterialSymbol
          icon="drag_pan"
          className="drag_pan btn btn-xs btn-outline btn-warning"
          size={22}
          grade={-25}
          weight={200}
        />
        <p>screen: {currentScreen}</p>
        <p>uuid: {uuid}</p>
      </div>
      {!!screenPanels && screenPanels}
    </GridLayout>
  );
}
