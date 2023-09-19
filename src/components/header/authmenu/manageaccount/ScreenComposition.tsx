import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../../app/hooks';
import {updateRefreshToken} from '../../../../app/slices/authSlice';
import {useChangePasswordMutation} from '../../../../app/api';

type ScreenCompositionProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ScreenComposition: FC<ScreenCompositionProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const {t} = useTranslation();
  const regexFinal = /^.{1,20}$/;
  const dispatch = useAppDispatch();

  const [
    requestPasswordChange,
    {isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useChangePasswordMutation();

  const [currentTask, setCurrentTask] = useState<'save' | 'load'>('save');

  const [currentTarget, setCurrentTarget] = useState<
    'localStorage' | 'server' | 'serverDefault'
  >('localStorage');

  const [currentNumber, setCurrentNumber] = useState<'1' | '2' | '3'>('1');

  const [currentTitle, setCurrentTitle] = useState<string>('');

  const handleChangeTask = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setCurrentTask(e.target.value as 'save' | 'load');
  }, []);

  const handleChangeTarget = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setCurrentTarget(
        e.target.value as 'localStorage' | 'server' | 'serverDefault'
      );
    },
    []
  );

  const handleChangeNumber = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setCurrentNumber(e.target.value as '1' | '2' | '3');
    },
    []
  );

  const handleChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^.{0,20}$/;
    if (regex.test(e.target.value)) {
      setCurrentTitle(e.target.value.trim());
    }
  }, []);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
      setCurrentTitle('');
    },
    [hideThisRef]
  );

  const onClickDeleteAccount = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
    },
    []
  );

  useEffect(() => {
    setIsUninitialized(isUninitialized);
  }, [isUninitialized, setIsUninitialized]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        hideThisRef();
        if (isSuccess) {
          dispatch(updateRefreshToken(null));
        }
        reset();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef, dispatch]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <select
          onChange={handleChangeTask}
          className="max-w-xs select select-info select-xs"
          value={currentTask}
        >
          <option value="save">{t('ScreenComposition.selectTask.save')}</option>
          <option value="load">{t('ScreenComposition.selectTask.load')}</option>
        </select>
        <select
          onChange={handleChangeTarget}
          className="max-w-xs select select-info select-xs"
          value={currentTarget}
        >
          <option value="localStorage">
            {t('ScreenComposition.selectTarget.localStorage')}
          </option>
          <option value="server">
            {t('ScreenComposition.selectTarget.server')}
          </option>
          {currentTask == 'load' && (
            <option value="serverDefault">
              {t('ScreenComposition.selectTarget.serverDefault')}
            </option>
          )}
        </select>
        <select
          onChange={handleChangeNumber}
          className="max-w-xs select select-info select-xs"
          value={currentNumber}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        {currentTask == 'save' && (
          <input
            type="text"
            name="currentTitle"
            placeholder={t('ScreenComposition.placeholder.title') as string}
            value={currentTitle}
            onChange={handleChangeTitle}
            className="w-28 max-w-xs input input-bordered input-sm"
          />
        )}
        <div className="flex-none w-52">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={!regexFinal.test(currentTitle)}
            onClick={onClickDeleteAccount}
            className={
              isLoading
                ? 'btn btn-xs btn-accent loading'
                : 'btn btn-xs btn-accent'
            }
          >
            {currentTask == 'save' && t('ScreenComposition.selectTask.save')}
            {currentTask == 'load' && t('ScreenComposition.selectTask.load')}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {isSuccess && <div>{t('DeleteAccount.Success')}</div>}
        {isError && <div>{t('DeleteAccount.Error')}</div>}
      </>
    );
  }
};

export default React.memo(ScreenComposition);
