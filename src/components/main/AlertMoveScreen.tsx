import React, {
  ChangeEvent,
  FC,
  MouseEventHandler,
  useCallback,
  useMemo
} from 'react';
import {useTranslation} from 'react-i18next';
import store from '../../app/store';
import {screensSelectors} from '../../app/hooks';

type AlertMoveScreenProps = {
  currentScreen: string;
  onClickCancel: MouseEventHandler<HTMLButtonElement>;
  onClickMove: MouseEventHandler<HTMLButtonElement>;
  targetScreen: string;
  setTargetScreen: React.Dispatch<React.SetStateAction<string>>;
};

const AlertMoveScreen: FC<AlertMoveScreenProps> = ({
  currentScreen,
  onClickMove,
  onClickCancel,
  targetScreen,
  setTargetScreen
}) => {
  const {t} = useTranslation();
  const screenTotal = screensSelectors.selectTotal(store.getState());

  const options = useMemo(
    () =>
      [...Array(screenTotal)].map(
        (_unused, index) =>
          index !== parseInt(currentScreen) - 1 && (
            <option value={(index + 1).toString()} key={index}>
              {index + 1}
            </option>
          )
      ),
    [currentScreen, screenTotal]
  );

  const handleChangeSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setTargetScreen(e.target.value);
    },
    [setTargetScreen]
  );

  return (
    <div className="fixed top-16 z-50 w-fit alert alert-warning text-sm">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
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
        <span>{t('AlertMoveScreen.Message', {currentScreen})}</span>
        <select
          onChange={handleChangeSelect}
          className="max-w-xs select select-ghost select-xs"
          value={targetScreen === currentScreen ? '0' : targetScreen}
        >
          <option disabled value="0">
            {t('AlertMoveScreen.Select')}
          </option>
          {options}
        </select>
      </div>

      <div className="flex-none">
        <button onClick={onClickCancel} className="btn btn-xs btn-ghost">
          {t('AlertMoveScreen.Cancel')}
        </button>
        <button
          disabled={
            parseInt(targetScreen) === 0 || targetScreen === currentScreen
          }
          onClick={onClickMove}
          className="btn btn-xs btn-primary"
        >
          {t('AlertMoveScreen.Move')}
        </button>
      </div>
    </div>
  );
};

export default React.memo(AlertMoveScreen);
