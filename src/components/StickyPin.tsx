import {MaterialSymbol} from 'react-material-symbols';
import React, {ChangeEvent, FC, useEffect, useState} from 'react';

export type StickyPinProps = {
  targetRef: React.RefObject<HTMLDivElement>;
  stickyPosition: string;
};

const StickyPin: FC<StickyPinProps> = ({targetRef, stickyPosition}) => {
  const [stickyPinChecked, setStickyPinChecked] = useState<boolean>(
    (localStorage.getItem(stickyPosition) || 'sticky') === 'sticky'
  );

  useEffect(() => {
    if (stickyPinChecked) {
      targetRef.current?.setAttribute(
        'class',
        ['sticky', stickyPosition].join(' ')
      );
    } else {
      targetRef.current?.removeAttribute('class');
    }
  }, [stickyPinChecked, targetRef, stickyPosition]);

  const handleChangeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setStickyPinChecked(e.target.checked);
    localStorage.setItem(
      stickyPosition,
      e.target.checked ? 'sticky' : 'notSticky'
    );
  };

  return (
    <label className="swap">
      <input
        type="checkbox"
        checked={stickyPinChecked}
        onChange={handleChangeChecked}
      />
      <MaterialSymbol
        icon="push_pin"
        className="swap-on"
        size={24}
        fill
        grade={-25}
      />
      <MaterialSymbol
        icon="push_pin"
        className="swap-off"
        size={24}
        grade={-25}
      />
    </label>
  );
};

export default StickyPin;
