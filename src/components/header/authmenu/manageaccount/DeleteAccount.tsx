import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useDeleteAccountMutation} from '../../../../app/api';
import {useAppDispatch} from '../../../../app/hooks';
import {updateToken} from '../../../../app/slices/authSlice';

type DeleteAccountProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAccount: FC<DeleteAccountProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const regexFinal = /^.{6,30}$/;
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [
    requestAccountDelete,
    {isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useDeleteAccountMutation();

  const [password, setPassword] = useState<string>('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^.{0,30}$/;
    if (regex.test(e.target.value)) {
      setPassword(e.target.value.trim());
    }
  }, []);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
      setPassword('');
    },
    [hideThisRef]
  );

  const onClickDeleteAccount = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        e.stopPropagation();
        const accountDeleteRequest = {
          password: password
        };
        await requestAccountDelete(accountDeleteRequest);
      } catch (err) {
        console.log(err);
      } finally {
        setPassword('');
      }
    },
    [password, requestAccountDelete]
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
          dispatch(updateToken(null));
        }
        reset();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef, dispatch]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <input
          type="password"
          name="password"
          placeholder={t('SignupForm.placeholder.password') as string}
          value={password}
          onChange={handleChange}
          className="w-44 max-w-xs input input-bordered input-sm"
        />
        <div className="flex-none w-52">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={!regexFinal.test(password)}
            onClick={onClickDeleteAccount}
            className={
              isLoading
                ? 'btn btn-xs btn-accent loading'
                : 'btn btn-xs btn-accent'
            }
          >
            {t('DeleteAccount.DeleteAccount')}
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

export default React.memo(DeleteAccount);
