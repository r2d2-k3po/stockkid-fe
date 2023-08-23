import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  addScreen,
  copyScreen,
  moveScreen,
  removeScreen
} from '../../app/slices/screensSlice';
import {v4 as uuidv4} from 'uuid';
import AlertRemoveScreen from './AlertRemoveScreen';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import AlertMoveScreen from './AlertMoveScreen';
import {panels} from './Panel';
import {mapReplacer} from '../../utils/mapReplacer';
import {breakpoints} from '../../app/constants/reactGridLayoutParemeters';
import {Layouts} from 'react-grid-layout';
import type {PanelType} from './Panel';
import {useTranslation} from 'react-i18next';
import {
  maxVirtualScreenNumber,
  minVirtualScreenNumber
} from '../../app/constants/virtualScreenNumbers';
import {invisibleRefVisibleRef} from '../../utils/invisibleRefVisibleRef';
import {visibleRefHiddenRef} from '../../utils/visibleRefHiddenRef';
import {screensSelectors} from '../../app/slices/screensSlice';
import store from '../../app/store';

type ContextType = {
  setCurrentBreakpoint: React.Dispatch<
    React.SetStateAction<keyof typeof breakpoints>
  >;
  compactType: 'vertical' | 'horizontal' | null;
};

export type MainProps = {
  mainClassName: string;
};

const Main: FC<MainProps> = ({mainClassName}) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const visibleScreenButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemoveScreenRef = useRef<HTMLDivElement>(null);
  const visibleAlertMoveScreenRef = useRef<HTMLDivElement>(null);

  const screenTotal = screensSelectors.selectTotal(store.getState());

  const [currentScreen, setCurrentScreen] = useState<string>(
    localStorage.getItem('currentScreen') || '1'
  );

  const [targetScreen, setTargetScreen] = useState<string>('0');

  const [selectedPanel, setSelectedPanel] = useState<keyof typeof panels | '0'>(
    '0'
  );

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof typeof breakpoints>('lg');

  const [compactType, setCompactType] = useState<
    'vertical' | 'horizontal' | 'null'
  >('vertical');

  // initialize screen 1
  useEffect(() => {
    if (!localStorage.getItem('screens')) {
      dispatch(addScreen(uuidv4()));
      setCurrentScreen('1');
      navigate('screen/1');
    }
  }, [dispatch, navigate]);

  const addVirtualScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      dispatch(addScreen(uuidv4()));
    },
    [dispatch]
  );

  const removeCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      invisibleRefVisibleRef(
        visibleScreenButtonsRef,
        visibleAlertRemoveScreenRef
      );
    },
    []
  );

  const reallyRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const index = parseInt(currentScreen) - 1;
      dispatch(removeScreen(index));
      if (index >= screenTotal - 1) {
        setCurrentScreen(index.toString());
        navigate(`/screen/${index.toString()}`);
      }
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertRemoveScreenRef);
    },
    [screenTotal, currentScreen, dispatch, navigate]
  );

  const cancelRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertRemoveScreenRef);
    },
    []
  );

  const moveCurrentScreen = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    invisibleRefVisibleRef(visibleScreenButtonsRef, visibleAlertMoveScreenRef);
  }, []);

  const reallyMoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      dispatch(
        moveScreen({
          currentIndex: parseInt(currentScreen) - 1,
          targetIndex: parseInt(targetScreen) - 1
        })
      );
      setCurrentScreen(targetScreen);
      navigate(`/screen/${targetScreen}`);
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertMoveScreenRef);
    },
    [currentScreen, targetScreen, dispatch, navigate]
  );

  const cancelMoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertMoveScreenRef);
    },
    []
  );

  const copyCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      dispatch(copyScreen(parseInt(currentScreen) - 1));
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
      const copiedScreen = (screenTotal + 1).toString();
      setCurrentScreen(copiedScreen);
      navigate('screen/' + copiedScreen);
    },
    [screenTotal, currentScreen, dispatch, navigate]
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
      e.stopPropagation();
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

  const handleChangeCompactType = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setCompactType(e.target.value as 'vertical' | 'horizontal' | 'null');
    },
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
    <div className={mainClassName}>
      <div className="flex flex-wrap justify-between">
        <div className="flex w-1/3 flex-wrap justify-start">
          <div ref={visibleScreenButtonsRef} className="visible">
            <div className="mx-5 flex flex-wrap justify-start gap-1 py-2">
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
                  onClick={copyCurrentScreen}
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

        <div className="mx-5 flex w-1/3 justify-end gap-2 py-2">
          <button
            disabled={selectedPanel === '0'}
            className="btn btn-xs btn-outline btn-accent"
            onClick={addNewPanel}
          >
            +
          </button>

          <select
            onChange={handleChangeSelectedPanel}
            className="max-w-xs select select-info select-xs"
            value={selectedPanel}
          >
            <option disabled value="0">
              {t('Main.SelectPanel')}
            </option>
            {optionsPanel}
          </select>

          <select
            onChange={handleChangeCompactType}
            className="max-w-xs select select-info select-xs"
            value={compactType}
          >
            <option value="vertical">{t('Main.CompactTypeVertical')}</option>
            <option value="horizontal">
              {t('Main.CompactTypeHorizontal')}
            </option>
            <option value="null">{t('Main.CompactTypeNone')}</option>
          </select>
        </div>
      </div>
      <Outlet context={{setCurrentBreakpoint, compactType}} />
    </div>
  );
};

export function useMainOutletContext() {
  return useOutletContext<ContextType>();
}

export default React.memo(Main);
