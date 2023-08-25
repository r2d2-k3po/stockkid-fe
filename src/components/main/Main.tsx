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
import store from '../../app/store';
import {
  screensSelectors,
  useAppDispatch,
  useAppSelector
} from '../../app/hooks';
import {
  addScreen,
  addScreenPanel,
  copyScreen,
  moveScreen,
  removeScreen
} from '../../app/slices/screensSlice';
import {v4 as uuidv4} from 'uuid';
import AlertRemoveScreen from './AlertRemoveScreen';
import {NavLink, Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import AlertMoveScreen from './AlertMoveScreen';
import {useTranslation} from 'react-i18next';
import {
  maxVirtualScreenNumber,
  minVirtualScreenNumber
} from '../../app/constants/virtualScreenNumbers';
import {invisibleRefVisibleRef} from '../../utils/invisibleRefVisibleRef';
import {visibleRefHiddenRef} from '../../utils/visibleRefHiddenRef';
import {PanelCode} from '../../app/slices/panelsSlice';
import {panelTypes} from './PanelBase';

type ContextType = {
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
  const screenIds = screensSelectors.selectIds(store.getState()) as string[];
  const screens = useAppSelector((state) => state.screens);
  const panels = useAppSelector((state) => state.panels);

  const [currentScreen, setCurrentScreen] = useState<string>(
    localStorage.getItem('currentScreen') || '1'
  );

  const currentIndex = parseInt(currentScreen) - 1;

  const currentPanelIds = screens.entities[screenIds[currentIndex]]
    ?.panelIds as string[];

  const [targetScreen, setTargetScreen] = useState<string>('0');

  const [selectedPanel, setSelectedPanel] = useState<PanelCode | '0'>('0');

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
      dispatch(
        removeScreen({
          currentIndex: currentIndex,
          panelIds: currentPanelIds
        })
      );
      if (currentIndex >= screenTotal - 1) {
        setCurrentScreen(currentIndex.toString());
        navigate(`/screen/${currentIndex.toString()}`);
      }
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertRemoveScreenRef);
    },
    [screenTotal, currentIndex, currentPanelIds, dispatch, navigate]
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
          currentIndex: currentIndex,
          targetIndex: parseInt(targetScreen) - 1
        })
      );
      setCurrentScreen(targetScreen);
      navigate(`/screen/${targetScreen}`);
      visibleRefHiddenRef(visibleScreenButtonsRef, visibleAlertMoveScreenRef);
    },
    [currentIndex, targetScreen, dispatch, navigate]
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
      const newPanelIds: string[] = [];
      for (let i = 0; i < currentPanelIds.length; i++) {
        newPanelIds.push(uuidv4());
      }
      dispatch(
        copyScreen({
          currentIndex: currentIndex,
          panelIds: currentPanelIds,
          newPanelIds: newPanelIds
        })
      );
      const copiedScreen = (screenTotal + 1).toString();
      setCurrentScreen(copiedScreen);
      navigate('screen/' + copiedScreen);
    },
    [screenTotal, currentIndex, currentPanelIds, dispatch, navigate]
  );

  const handleChangeSelectedPanel = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setSelectedPanel(e.target.value as PanelCode | '0');
    },
    []
  );

  const addNewPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      dispatch(
        addScreenPanel({
          currentIndex: currentIndex,
          panelId: uuidv4(),
          panelCode: selectedPanel as PanelCode
        })
      );
    },
    [currentIndex, selectedPanel, dispatch]
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
      screenIds.map((uuid, index) => (
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
    [screenIds, handleScreenButtonClick]
  );

  const optionsPanel = useMemo(
    () =>
      Object.keys(panelTypes).map((key) => (
        <option key={key} value={key}>
          {key}
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
    localStorage.setItem('screens', JSON.stringify(screens));
  }, [screens]);

  useEffect(() => {
    localStorage.setItem('panels', JSON.stringify(panels));
  }, [panels]);

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
                disabled={screenTotal >= maxVirtualScreenNumber}
                className="btn btn-xs btn-outline btn-secondary"
                onClick={addVirtualScreen}
              >
                +
              </button>

              <div className="flex justify-start gap-1">
                <button
                  disabled={screenTotal <= minVirtualScreenNumber}
                  className="btn btn-xs btn-outline btn-warning"
                  onClick={removeCurrentScreen}
                >
                  {currentScreen} -
                </button>

                <button
                  disabled={screenTotal <= minVirtualScreenNumber}
                  className="btn btn-xs btn-outline btn-warning"
                  onClick={moveCurrentScreen}
                >
                  M
                </button>

                <button
                  disabled={screenTotal >= maxVirtualScreenNumber}
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
      <Outlet context={{compactType}} />
    </div>
  );
};

export function useMainOutletContext() {
  return useOutletContext<ContextType>();
}

export default React.memo(Main);
