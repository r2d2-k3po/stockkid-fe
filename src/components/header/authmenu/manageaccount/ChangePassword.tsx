import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {ResponseEntity, useChangePasswordMutation} from '../../../../app/api';

type ChangePasswordFormType = Record<
  'oldPassword' | 'newPassword' | 'confirmNewPassword',
  string
>;

type ChangePasswordProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangePassword: FC<ChangePasswordProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const regexFinal = /^.{6,30}$/;

  const {t} = useTranslation();

  const [
    requestPasswordChange,
    {data, error, isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useChangePasswordMutation();

  const [{oldPassword, newPassword, confirmNewPassword}, setForm] =
    useState<ChangePasswordFormType>({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

  const handleChange = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        setForm((obj) => ({...obj, [key]: e.target.value.trim()}));
      }
    },
    []
  );

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
      setForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    },
    [hideThisRef]
  );

  const onClickChangePassword = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        e.stopPropagation();
        const passwordChangeRequest = {
          oldPassword: oldPassword,
          newPassword: newPassword
        };
        await requestPasswordChange(passwordChangeRequest);
      } catch (err) {
        console.log(err);
      } finally {
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    },
    [requestPasswordChange, oldPassword, newPassword]
  );

  const onClickReset = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      reset();
      hideThisRef();
    },
    [hideThisRef, reset]
  );

  useEffect(() => {
    setIsUninitialized(isUninitialized);
  }, [isUninitialized, setIsUninitialized]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <input
          type="password"
          name="oldPassword"
          placeholder={t('ManageAccount.placeholder.oldPassword') as string}
          value={oldPassword}
          onChange={handleChange('oldPassword')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <input
          type="password"
          name="newPassword"
          placeholder={t('ManageAccount.placeholder.newPassword') as string}
          value={newPassword}
          onChange={handleChange('newPassword')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder={
            t('ManageAccount.placeholder.confirmNewPassword') as string
          }
          value={confirmNewPassword}
          onChange={handleChange('confirmNewPassword')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <div className="flex-none">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={
              !regexFinal.test(oldPassword) ||
              !regexFinal.test(newPassword) ||
              newPassword != confirmNewPassword
            }
            onClick={onClickChangePassword}
            className={
              isLoading
                ? 'btn btn-xs btn-accent loading'
                : 'btn btn-xs btn-accent'
            }
          >
            {t('ManageAccount.ChangePassword')}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {isSuccess && (
          <div>
            Status : {(data as ResponseEntity).apiStatus}, Message :{' '}
            {(data as ResponseEntity).apiMsg}
          </div>
        )}
        {isError && <div>Error : {JSON.stringify(error)}</div>}
        <button onClick={onClickReset} className="btn btn-xs btn-accent mx-1">
          {t('SignupForm.Reset')}
        </button>
      </>
    );
  }
};

export default React.memo(ChangePassword);
