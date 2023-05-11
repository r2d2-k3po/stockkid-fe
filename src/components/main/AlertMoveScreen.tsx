import React, {
  ChangeEvent,
  FC,
  MouseEventHandler,
  useCallback,
  useMemo
} from 'react';

export type AlertMoveScreenProps = {
  currentScreen: string;
  onClickCancel: MouseEventHandler<HTMLButtonElement>;
  onClickMove: MouseEventHandler<HTMLButtonElement>;
  uuidLength: number;
  setTargetScreen: React.Dispatch<React.SetStateAction<string>>;
};

const AlertMoveScreen: FC<AlertMoveScreenProps> = ({
  currentScreen,
  onClickMove,
  onClickCancel,
  uuidLength,
  setTargetScreen
}) => {
  const options = useMemo(
    () =>
      [...Array(uuidLength)].map(
        (unused, index) =>
          index !== parseInt(currentScreen) - 1 && (
            <option key={index}>{index + 1}</option>
          )
      ),
    [currentScreen, uuidLength]
  );

  const handleChangeSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setTargetScreen(e.target.value);
    },
    [setTargetScreen]
  );

  return (
    <div className="alert alert-warning fixed top-16 w-fit">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Warning: {currentScreen} will be moved to</span>
        <select
          onChange={handleChangeSelect}
          className="select select-ghost select-xs max-w-xs"
        >
          <option disabled selected>
            Select
          </option>
          {options}
        </select>
      </div>

      <div className="flex-none">
        <button onClick={onClickCancel} className="btn btn-xs btn-ghost">
          Cancel
        </button>
        <button onClick={onClickMove} className="btn btn-xs btn-primary">
          Move
        </button>
      </div>
    </div>
  );
};

export default AlertMoveScreen;
