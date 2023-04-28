import React, {MouseEvent, useCallback, useMemo} from 'react';
import VirtualScreen from './VirtualScreen';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {set, add, remove} from './virtualScreenIdSlice';
import {v4 as uuidv4} from 'uuid';

export default function Main() {
  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const dispatch = useAppDispatch();

  const addVirtualScreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(add(uuidv4()));
    },
    [dispatch]
  );

  const screenButtons = useMemo(
    () =>
      uuidList.map((uuid, index) => (
        <a
          key={uuid}
          href={'#Screen' + (index + 1).toString()}
          className="btn btn-xs btn-outline btn-info"
        >
          {index + 1}
        </a>
      )),
    [uuidList]
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

  return (
    <div>
      <div className="sticky top-0 flex justify-start ml-60 py-2 gap-2 w-40">
        {screenButtons}
        <button
          className="btn btn-xs btn-outline btn-info"
          onClick={addVirtualScreen}
        >
          +
        </button>
      </div>
      <div className="carousel w-full">{virtualScreens}</div>
    </div>
  );
}
