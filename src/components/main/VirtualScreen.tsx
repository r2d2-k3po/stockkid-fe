import React, {useCallback, useMemo, useState} from 'react';
import Panel, {panelGrids} from './Panel';
import {Params, useLoaderData} from 'react-router-dom';
import {useAppSelector} from '../../app/hooks';
import type {PanelMap} from '../../app/screenPanelMapSlice';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {MaterialSymbol} from 'react-material-symbols';
import {breakpoints, cols} from '../../app/screenLayoutsMapSlice';

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

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof typeof breakpoints>('lg');

  const handleBreakpointChange = useCallback(
    (newBreakpoint: string, newCols: number) => {
      setCurrentBreakpoint(newBreakpoint as keyof typeof breakpoints);
    },
    []
  );

  const screenPanels = useMemo(() => {
    const panelArray: JSX.Element[] = [];
    if (uuidPanelMap.get(uuid)) {
      for (const entry of (uuidPanelMap.get(uuid) as PanelMap).entries()) {
        panelArray.push(
          <Panel
            key={entry[0]}
            data-grid={panelGrids[entry[1].panelCode]}
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
    <ResponsiveReactGridLayout
      className="layout"
      // layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={80}
      autoSize={true}
      draggableHandle=".drag_pan"
      margin={[2, 2]}
      compactType={null}
      // onLayoutChange={}
      onBreakpointChange={handleBreakpointChange}
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
    </ResponsiveReactGridLayout>
  );
}
