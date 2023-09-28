import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useChangePasswordMutation} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';

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
    {isUninitialized, isLoading, isSuccess, isError, reset}
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
      e.stopPropagation();
      try {
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

  useEffect(() => {
    setIsUninitialized(isUninitialized);
  }, [isUninitialized, setIsUninitialized]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        reset();
        hideThisRef();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <input
          type="password"
          name="oldPassword"
          placeholder={t('ManageAccount.placeholder.oldPassword') as string}
          value={oldPassword}
          onChange={handleChange('oldPassword')}
          className="w-44 max-w-xs input input-bordered input-sm text-accent-content"
        />
        <input
          type="password"
          name="newPassword"
          placeholder={t('ManageAccount.placeholder.newPassword') as string}
          value={newPassword}
          onChange={handleChange('newPassword')}
          className="w-44 max-w-xs input input-bordered input-sm text-accent-content"
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder={
            t('ManageAccount.placeholder.confirmNewPassword') as string
          }
          value={confirmNewPassword}
          onChange={handleChange('confirmNewPassword')}
          className="w-44 max-w-xs input input-bordered input-sm text-accent-content"
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
        {isSuccess && <MaterialSymbolSuccess />}
        {isError && <MaterialSymbolError />}
      </>
    );
  }
};

export default React.memo(ChangePassword);
