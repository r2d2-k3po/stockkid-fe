import React, {FC, MouseEventHandler} from 'react';
import {useTranslation} from 'react-i18next';

type AlertRemoveScreenProps = {
  currentScreen: string;
  onClickCancel: MouseEventHandler<HTMLButtonElement>;
  onClickRemove: MouseEventHandler<HTMLButtonElement>;
};

const AlertRemoveScreen: FC<AlertRemoveScreenProps> = ({
  currentScreen,
  onClickRemove,
  onClickCancel
}) => {
  const {t} = useTranslation();

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
        <span>{t('AlertRemoveScreen.Message', {currentScreen})}</span>
      </div>
      <div className="flex-none">
        <button onClick={onClickCancel} className="btn btn-xs btn-ghost">
          {t('AlertRemoveScreen.Cancel')}
        </button>
        <button onClick={onClickRemove} className="btn btn-xs btn-primary">
          {t('AlertRemoveScreen.Remove')}
        </button>
      </div>
    </div>
  );
};

export default React.memo(AlertRemoveScreen);
