import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {moveScreen, addScreen, removeScreen} from './virtualScreenIdSlice';
import {v4 as uuidv4} from 'uuid';
import AlertRemoveScreen from './AlertRemoveScreen';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import AlertMoveScreen from './AlertMoveScreen';

export default function Main() {
  const minVirtualScreenNumber = 1;
  const maxVirtualScreenNumber = 10;

  const navigate = useNavigate();

  const visibleScreenButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemoveScreenRef = useRef<HTMLDivElement>(null);
  const visibleAlertMoveScreenRef = useRef<HTMLDivElement>(null);

  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const dispatch = useAppDispatch();

  const [currentScreen, setCurrentScreen] = useState<string>(
    localStorage.getItem('currentScreen') || '1'
  );

  const [targetScreen, setTargetScreen] = useState<string>('1');

  const addVirtualScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(addScreen(uuidv4()));
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
      const index = parseInt(currentScreen) - 1;
      dispatch(removeScreen(uuidList[index]));
      if (index >= uuidList.length - 1) {
        setCurrentScreen(index.toString());
        navigate(`/screen/${index.toString()}`);
      }
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertMoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    [currentScreen, uuidList, dispatch, navigate]
  );

  const cancelMoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertMoveScreenRef.current?.setAttribute('class', 'hidden');
    },
    []
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
              'btn btn-xs btn-outline btn-info',
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

  useEffect(() => {
    localStorage.setItem('virtualScreenUuidList', JSON.stringify(uuidList));
  }, [uuidList]);

  useEffect(() => {
    localStorage.setItem('currentScreen', currentScreen);
  }, [currentScreen]);

  return (
    <div>
      <div className="flex flex-wrap justify-between">
        <div className="flex justify-start">
          <div ref={visibleScreenButtonsRef} className="visible">
            <div className="flex justify-start mx-5 py-2 gap-1 w-fit">
              {screenButtons}

              <button
                disabled={uuidList.length >= maxVirtualScreenNumber}
                className="btn btn-xs btn-outline btn-info"
                onClick={addVirtualScreen}
              >
                +
              </button>

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
              uuidLength={uuidList.length}
              setTargetScreen={setTargetScreen}
            />
          </div>
        </div>

        <div className="flex justify-end mx-5 py-2 gap-1 w-fit">
          <select className="select select-info select-xs w-full max-w-xs">
            <option disabled selected>
              Select panel
            </option>
            <option>panel0000</option>
            <option>panel0001</option>
            <option>panel0002</option>
            <option>panel0003</option>
          </select>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
