import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import MaterialSymbolButton from '../../../common/MaterialSymbolButton';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import DeleteGoogleAccount from './DeleteGoogleAccount';
import DeleteNaverAccount from './DeleteNaverAccount';
import DeleteKakaoAccount from './DeleteKakaoAccount';
import ScreenComposition from './ScreenComposition';

type ManageAccountProps = {
  loginMethod: string | null;
  hideThisRef: () => void;
};

const ManageAccount: FC<ManageAccountProps> = ({loginMethod, hideThisRef}) => {
  const {t} = useTranslation();

  const [currentTask, setCurrentTask] = useState<
    'screenComposition' | 'changePassword' | 'deleteAccount'
  >('screenComposition');

  const [isUninitialized, setIsUninitialized] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeTask = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setCurrentTask(
      e.target.value as 'screenComposition' | 'changePassword' | 'deleteAccount'
    );
  }, []);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

  useEffect(() => {
    if (loginMethod != 'UP') {
      setCurrentTask('screenComposition');
    }
  }, [loginMethod]);

  return (
    <div className="mx-2 flex items-center gap-1 w-full">
      <button onClick={onClickCancel}>
        <MaterialSymbolButton icon="manage_accounts" />
      </button>
      {(isUninitialized || isLoading) && (
        <select
          onChange={handleChangeTask}
          className="max-w-xs select select-info select-xs text-accent-content"
          value={currentTask}
        >
          <option value="screenComposition">
            {t('ManageAccount.select.screenComposition')}
          </option>
          {loginMethod == 'UP' && (
            <option value="changePassword">
              {t('ManageAccount.select.changePassword')}
            </option>
          )}
          {loginMethod && (
            <option value="deleteAccount">
              {t('ManageAccount.select.deleteAccount')}
            </option>
          )}
        </select>
      )}
      {currentTask == 'screenComposition' && (
        <ScreenComposition
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
        />
      )}
      {loginMethod == 'UP' && currentTask == 'changePassword' && (
        <ChangePassword
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
          setIsLoading={setIsLoading}
        />
      )}
      {loginMethod == 'UP' && currentTask == 'deleteAccount' && (
        <DeleteAccount
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
          setIsLoading={setIsLoading}
        />
      )}
      {loginMethod == 'GGL' && currentTask == 'deleteAccount' && (
        <DeleteGoogleAccount
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
          setIsLoading={setIsLoading}
        />
      )}
      {loginMethod == 'NAV' && currentTask == 'deleteAccount' && (
        <DeleteNaverAccount
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
          setIsLoading={setIsLoading}
        />
      )}
      {loginMethod == 'KKO' && currentTask == 'deleteAccount' && (
        <DeleteKakaoAccount
          hideThisRef={hideThisRef}
          setIsUninitialized={setIsUninitialized}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default React.memo(ManageAccount);
