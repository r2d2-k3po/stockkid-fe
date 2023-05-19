import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  moveScreen,
  addScreen,
  removeScreen
} from '../../app/virtualScreenIdSlice';
import {v4 as uuidv4} from 'uuid';
import AlertRemoveScreen from './AlertRemoveScreen';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import AlertMoveScreen from './AlertMoveScreen';
import {panels} from './Panel';
import {
  addPanel,
  addScreenPanel,
  PanelMap,
  removeScreenPanel
} from '../../app/screenPanelMapSlice';
import {mapReplacer} from '../../utils/mapReplacer';
import {
  addPanelLayouts,
  addScreenLayouts,
  LayoutItemType,
  removeScreenLayouts
} from '../../app/screenLayoutsMapSlice';
import {breakpoints} from '../../app/reactGridLayoutParemeters';
import {Layouts} from 'react-grid-layout';
import type {PanelType} from './Panel';

type SetCurrentBreakpointContextType = {
  setCurrentBreakpoint: React.Dispatch<
    React.SetStateAction<keyof typeof breakpoints>
  >;
};

export default function Main() {
  const minVirtualScreenNumber = 1;
  const maxVirtualScreenNumber = 10;

  const navigate = useNavigate();

  const visibleScreenButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemoveScreenRef = useRef<HTMLDivElement>(null);
  const visibleAlertMoveScreenRef = useRef<HTMLDivElement>(null);

  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const uuidPanelMap = useAppSelector(
    (state) => state.screenPanelMap.uuidPanelMap
  );
  const uuidLayoutsMap = useAppSelector(
    (state) => state.screenLayoutsMap.uuidLayoutsMap
  );
  const dispatch = useAppDispatch();

  const [currentScreen, setCurrentScreen] = useState<string>(
    localStorage.getItem('currentScreen') || '1'
  );

  const [targetScreen, setTargetScreen] = useState<string>('0');

  const [selectedPanel, setSelectedPanel] = useState<keyof typeof panels | '0'>(
    '0'
  );

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof typeof breakpoints>('lg');

  // initialize screen 1
  useEffect(() => {
    if (!localStorage.getItem('virtualScreenUuidList')) {
      const uuid = uuidv4();
      dispatch(addScreen(uuid));
      dispatch(addScreenPanel(uuid));
      dispatch(addScreenLayouts(uuid));
      setCurrentScreen('1');
      navigate('screen/1');
    }
  }, [dispatch, navigate]);

  const addVirtualScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const uuid = uuidv4();
      dispatch(addScreen(uuid));
      dispatch(addScreenPanel(uuid));
      dispatch(addScreenLayouts(uuid));
    },
    [dispatch]
  );

  const removeCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'invisible');
      visibleAlertRemoveScreenRef.current?.removeAttribute('class');
    },
    []
  );

  const reallyRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const index = parseInt(currentScreen) - 1;
      dispatch(removeScreen(uuidList[index]));
      dispatch(removeScreenPanel(uuidList[index]));
      dispatch(removeScreenLayouts(uuidList[index]));
      if (index >= uuidList.length - 1) {
        setCurrentScreen(index.toString());
        navigate(`/screen/${index.toString()}`);
      }
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    [currentScreen, uuidList, dispatch, navigate]
  );

  const cancelRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    []
  );

  const moveCurrentScreen = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    visibleScreenButtonsRef.current?.setAttribute('class', 'invisible');
    visibleAlertMoveScreenRef.current?.removeAttribute('class');
  }, []);

  const reallyMoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const payload = {
        currentIndex: parseInt(currentScreen) - 1,
        targetIndex: parseInt(targetScreen) - 1
      };
      dispatch(moveScreen(payload));
      setCurrentScreen(targetScreen);
      navigate(`/screen/${targetScreen}`);
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertMoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    [currentScreen, targetScreen, dispatch, navigate]
  );

  const cancelMoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertMoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    []
  );

  const copyCurrentScreenPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const currentUuid = uuidList[parseInt(currentScreen) - 1];
      const newUuid = uuidv4();
      dispatch(addScreen(newUuid));
      dispatch(addScreenPanel(newUuid));
      dispatch(addScreenLayouts(newUuid));
      if (uuidPanelMap.get(currentUuid)) {
        const currentPanelMap = uuidPanelMap.get(currentUuid) as PanelMap;
        const currentLayouts = uuidLayoutsMap.get(currentUuid) as Layouts;
        for (const key of currentPanelMap.keys()) {
          const uuidP = uuidv4();
          const panelCode = (currentPanelMap.get(key) as PanelType).panelCode;
          const payload = {
            uuid: newUuid,
            uuidP: uuidP,
            panelCode: panelCode
          };
          dispatch(addPanel(payload));
          const layoutItem = currentLayouts[currentBreakpoint].find(
            (item) => item.i === key
          ) as LayoutItemType;
          const layoutsPayload = {
            uuid: newUuid,
            uuidP: uuidP,
            currentBreakpoint: currentBreakpoint,
            panelCode: panelCode,
            layoutItem: layoutItem
          };
          dispatch(addPanelLayouts(layoutsPayload));
        }
      }
      const copiedScreen = (uuidList.length + 1).toString();
      setCurrentScreen(copiedScreen);
      navigate('screen/' + copiedScreen);
    },
    [
      currentScreen,
      uuidList,
      uuidPanelMap,
      uuidLayoutsMap,
      currentBreakpoint,
      dispatch,
      navigate
    ]
  );

  const handleChangeSelectedPanel = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setSelectedPanel(e.target.value as keyof typeof panels | '0');
    },
    []
  );

  const addNewPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const uuid = uuidList[parseInt(currentScreen) - 1];
      const uuidP = uuidv4();
      const payload = {
        uuid: uuid,
        uuidP: uuidP,
        panelCode: selectedPanel as keyof typeof panels
      };
      dispatch(addPanel(payload));
      const layoutsPayload = {
        uuid: uuid,
        uuidP: uuidP,
        currentBreakpoint: currentBreakpoint,
        panelCode: selectedPanel as keyof typeof panels
      };
      dispatch(addPanelLayouts(layoutsPayload));
    },
    [currentScreen, uuidList, selectedPanel, currentBreakpoint, dispatch]
  );

  const handleScreenButtonClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      setCurrentScreen(
        (e.currentTarget.getAttribute('href') as string).substring(8)
      );
    },
    []
  );

  const screenButtons = useMemo(
    () =>
      uuidList.map((uuid, index) => (
        <NavLink
          key={uuid}
          to={`/screen/${(index + 1).toString()}`}
          className={({isActive, isPending}) =>
            [
              'btn btn-xs btn-outline btn-primary',
              isPending ? 'loading' : isActive ? 'btn-active' : ''
            ].join(' ')
          }
          onClick={handleScreenButtonClick}
        >
          {index + 1}
        </NavLink>
      )),
    [uuidList, handleScreenButtonClick]
  );

  const optionsPanel = useMemo(
    () =>
      Object.keys(panels).map((panel) => (
        <option key={panel} value={panel}>
          {panel}
        </option>
      )),
    []
  );

  useEffect(() => {
    localStorage.setItem('virtualScreenUuidList', JSON.stringify(uuidList));
  }, [uuidList]);

  useEffect(() => {
    localStorage.setItem(
      'screenUuidPanelMap',
      JSON.stringify(uuidPanelMap, mapReplacer)
    );
  }, [uuidPanelMap]);

  useEffect(() => {
    localStorage.setItem(
      'screenUuidLayoutsMap',
      JSON.stringify(uuidLayoutsMap, mapReplacer)
    );
  }, [uuidLayoutsMap]);

  useEffect(() => {
    localStorage.setItem('currentScreen', currentScreen);
  }, [currentScreen]);

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <div className="flex flex-wrap justify-start w-1/3">
          <div ref={visibleScreenButtonsRef} className="visible">
            <div className="flex flex-wrap justify-start mx-5 py-2 gap-1">
              {screenButtons}

              <button
                disabled={uuidList.length >= maxVirtualScreenNumber}
                className="btn btn-xs btn-outline btn-secondary"
                onClick={addVirtualScreen}
              >
                +
              </button>

              <div className="flex justify-start gap-1">
                <button
                  disabled={uuidList.length <= minVirtualScreenNumber}
                  className="btn btn-xs btn-outline btn-warning"
                  onClick={removeCurrentScreen}
                >
                  {currentScreen} -
                </button>

                <button
                  disabled={uuidList.length <= minVirtualScreenNumber}
                  className="btn btn-xs btn-outline btn-warning"
                  onClick={moveCurrentScreen}
                >
                  M
                </button>

                <button
                  disabled={uuidList.length >= maxVirtualScreenNumber}
                  className="btn btn-xs btn-outline btn-warning"
                  onClick={copyCurrentScreenPanel}
                >
                  C
                </button>
              </div>
            </div>
          </div>

          <div ref={visibleAlertRemoveScreenRef} className="hidden">
            <AlertRemoveScreen
              currentScreen={currentScreen}
              onClickCancel={cancelRemoveCurrentScreen}
              onClickRemove={reallyRemoveCurrentScreen}
            />
          </div>

          <div ref={visibleAlertMoveScreenRef} className="hidden">
            <AlertMoveScreen
              currentScreen={currentScreen}
              onClickCancel={cancelMoveCurrentScreen}
              onClickMove={reallyMoveCurrentScreen}
              uuidListLength={uuidList.length}
              targetScreen={targetScreen}
              setTargetScreen={setTargetScreen}
            />
          </div>
        </div>

        <div className="flex justify-end mx-5 py-2 gap-1 w-1/3">
          <button
            disabled={selectedPanel === '0'}
            className="btn btn-xs btn-outline btn-accent"
            onClick={addNewPanel}
          >
            +
          </button>

          <select
            onChange={handleChangeSelectedPanel}
            className="select select-info select-xs max-w-xs"
            value={selectedPanel}
          >
            <option disabled value="0">
              Select panel
            </option>
            {optionsPanel}
          </select>
        </div>
      </div>

      <Outlet context={{setCurrentBreakpoint}} />
    </div>
  );
}

export function useSetCurrentBreakpoint() {
  return useOutletContext<SetCurrentBreakpointContextType>();
}
