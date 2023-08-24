import React, {useCallback, useMemo} from 'react';
import store from '../../app/store';
import PanelBase from './PanelBase';
import {Params, useLoaderData} from 'react-router-dom';
import {
  panelsSelectors,
  screensSelectors,
  useAppDispatch
} from '../../app/hooks';
import {Layout, Layouts, Responsive, WidthProvider} from 'react-grid-layout';
import {useMainOutletContext} from './Main';
import {
  autoSize,
  breakpoints,
  cols,
  margin,
  rowHeight
} from '../../app/constants/reactGridLayoutParemeters';
import {updateScreenLayouts} from '../../app/slices/screensSlice';

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
  const dispatch = useAppDispatch();

  const currentIndex = parseInt(currentScreen) - 1;
  const screenId = screensSelectors.selectIds(store.getState())[currentIndex];
  const layouts = screensSelectors.selectById(store.getState(), screenId)
    ?.layouts as Layouts;
  const panelIds = panelsSelectors.selectIds(store.getState());

  const handleBreakpointChange = useCallback(
    (newBreakpoint: string) => {
      setCurrentBreakpoint(newBreakpoint as keyof typeof breakpoints);
    },
    [setCurrentBreakpoint]
  );

  const handleLayoutChange = useCallback(
    (currentLayout: Layout[], allLayouts: Layouts) => {
      dispatch(
        updateScreenLayouts({
          currentIndex: currentIndex,
          layouts: allLayouts
        })
      );
    },
    [currentIndex, dispatch]
  );

  const screenPanels = useMemo(
    () =>
      panelIds.map((panelId) => (
        <PanelBase key={panelId} screenId={screenId} panelId={panelId} />
      )),
    [screenId, panelIds]
  );

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
