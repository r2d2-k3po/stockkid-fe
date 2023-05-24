import {MaterialSymbol} from 'react-material-symbols';
import React, {ChangeEvent, FC, useCallback} from 'react';

export type FixedPinProps = {
  fixed: boolean;
  setFixed: React.Dispatch<React.SetStateAction<boolean>>;
};

const FixedPin: FC<FixedPinProps> = ({fixed, setFixed}) => {
  const handleChangeChecked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setFixed(e.target.checked);
    },
    [setFixed]
  );

  return (
    <label className="swap">
      <input type="checkbox" checked={fixed} onChange={handleChangeChecked} />
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

export default FixedPin;
