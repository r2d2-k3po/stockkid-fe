import React, {useCallback, useMemo} from 'react';
import Panel from './Panel';
import {Params, useLoaderData} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import type {PanelMap} from '../../app/screenPanelMapSlice';
import {Layout, Layouts, Responsive, WidthProvider} from 'react-grid-layout';
import {updateLayouts} from '../../app/screenLayoutsMapSlice';
import {useMainOutletContext} from './Main';
import {
  autoSize,
  breakpoints,
  cols,
  margin,
  rowHeight
} from '../../app/reactGridLayoutParemeters';

export const loader = ({params}: {params: Params}) => {
  return params.currentScreen as string;
};

function VirtualScreen() {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const currentScreen = useLoaderData() as string;
  const {setCurrentBreakpoint, compactType} = useMainOutletContext();

  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const uuidPanelMap = useAppSelector(
    (state) => state.screenPanelMap.uuidPanelMap
  );
  const uuidLayoutsMap = useAppSelector(
    (state) => state.screenLayoutsMap.uuidLayoutsMap
  );
  const dispatch = useAppDispatch();

  const uuid = uuidList[parseInt(currentScreen) - 1];
  const layouts = uuidLayoutsMap.get(uuid) as Layouts;

  const handleBreakpointChange = useCallback(
    (newBreakpoint: string) => {
      setCurrentBreakpoint(newBreakpoint as keyof typeof breakpoints);
    },
    [setCurrentBreakpoint]
  );

  const handleLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts) => {
      const payload = {
        uuid: uuid,
        layouts: allLayouts
      };
      dispatch(updateLayouts(payload));
    },
    [uuid, dispatch]
  );

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
    <ResponsiveReactGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={rowHeight}
      autoSize={autoSize}
      draggableHandle=".drag_pan"
      margin={margin}
      compactType={compactType}
      onLayoutChange={handleLayoutChange}
      onBreakpointChange={handleBreakpointChange}
    >
      {!!screenPanels && screenPanels}
    </ResponsiveReactGridLayout>
  );
}

export default React.memo(VirtualScreen);
