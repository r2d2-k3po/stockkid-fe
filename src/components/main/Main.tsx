import React, {MouseEvent} from 'react';
import VirtualScreen from './VirtualScreen';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {set, add, remove} from './virtualScreenIdSlice';

export default function Main() {
  const uuidList = useAppSelector((state) => state.virtualScreenId.uuidList);
  const dispatch = useAppDispatch();

  const addVirtualScreen = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const screenButtons = uuidList.map((uuid, index) => (
    <a
      key={uuid}
      href={'#Screen' + index.toString()}
      className="btn btn-xs btn-outline btn-info"
    >
      {index + 1}
    </a>
  ));

  const virtualScreens = uuidList.map((uuid, index) => (
    <div
      key={uuid}
      id={'Screen' + index.toString()}
      className="carousel-item w-full"
    >
      <VirtualScreen uuid={uuid} />
    </div>
  ));

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
