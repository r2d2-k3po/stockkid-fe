import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import VirtualScreen from './VirtualScreen';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {set, add, remove} from './virtualScreenIdSlice';
import {v4 as uuidv4} from 'uuid';
import AlertRemoveScreen from './AlertRemoveScreen';

export default function Main() {
  const minVirtualScreenNumber = 1;
  const maxVirtualScreenNumber = 10;

  const addVirtualScreenButtonRef = useRef<HTMLButtonElement>(null);
  const removeCurrentScreenButtonRef = useRef<HTMLButtonElement>(null);
  const visibleScreenButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemoveScreenRef = useRef<HTMLDivElement>(null);

  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const dispatch = useAppDispatch();

  const [currentScreen, setCurrentScreen] = useState<string>('Screen1');

  const addVirtualScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(add(uuidv4()));
    },
    [dispatch]
  );

  const removeCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'invisible');
      visibleAlertRemoveScreenRef.current?.setAttribute('class', 'visible');
    },
    []
  );

  const reallyRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const index = parseInt(currentScreen.substring(6)) - 1;
      dispatch(remove(uuidList[index]));
      if (index >= uuidList.length - 1) setCurrentScreen('Screen' + index);
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemoveScreenRef.current?.setAttribute('class', 'invisible');
    },
    [currentScreen, uuidList, dispatch]
  );

  const cancelRemoveCurrentScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visibleScreenButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemoveScreenRef.current?.setAttribute('class', 'invisible');
    },
    []
  );

  const handleScreenButtonClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      setCurrentScreen(
        (e.currentTarget.getAttribute('href') as string).substring(1)
      );
    },
    []
  );

  const screenButtons = useMemo(
    () =>
      uuidList.map((uuid, index) => (
        <a
          key={uuid}
          href={'#Screen' + (index + 1).toString()}
          className="btn btn-xs btn-outline btn-info"
          onClick={handleScreenButtonClick}
        >
          {index + 1}
        </a>
      )),
    [uuidList, handleScreenButtonClick]
  );

  const virtualScreens = useMemo(
    () =>
      uuidList.map((uuid, index) => (
        <div
          key={uuid}
          id={'Screen' + (index + 1).toString()}
          className="carousel-item w-full"
        >
          <VirtualScreen uuid={uuid} />
        </div>
      )),
    [uuidList]
  );

  useEffect(() => {
    if (uuidList.length >= maxVirtualScreenNumber) {
      addVirtualScreenButtonRef.current?.setAttribute('disabled', '');
    } else {
      addVirtualScreenButtonRef.current?.removeAttribute('disabled');
    }
    if (uuidList.length <= minVirtualScreenNumber) {
      removeCurrentScreenButtonRef.current?.setAttribute('disabled', '');
    } else {
      removeCurrentScreenButtonRef.current?.removeAttribute('disabled');
    }
  }, [uuidList.length]);

  return (
    <div>
      <div className="flex justify-start mx-5 py-2 gap-2">
        <div ref={visibleScreenButtonsRef} className="visible">
          {screenButtons}
          <button
            ref={addVirtualScreenButtonRef}
            className="btn btn-xs btn-outline btn-info"
            onClick={addVirtualScreen}
          >
            +
          </button>

          <button
            ref={removeCurrentScreenButtonRef}
            className="btn btn-xs btn-outline btn-warning"
            onClick={removeCurrentScreen}
          >
            {currentScreen} -
          </button>
        </div>
        <div ref={visibleAlertRemoveScreenRef} className="invisible">
          <AlertRemoveScreen
            currentScreen={currentScreen}
            onClickCancel={cancelRemoveCurrentScreen}
            onClickRemove={reallyRemoveCurrentScreen}
          />
        </div>
      </div>

      <div className="carousel w-full">{virtualScreens}</div>
    </div>
  );
}
