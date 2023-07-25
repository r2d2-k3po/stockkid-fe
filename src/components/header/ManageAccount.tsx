import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import MaterialSymbolButton from '../common/MaterialSymbolButton';
import {useChangePasswordMutation} from '../../app/api';

type ChangePasswordFormType = Record<
  'oldPassword' | 'newPassword' | 'confirmNewPassword',
  string
>;

type ManageAccountProps = {
  hideThisRef: () => void;
};

const ManageAccount: FC<ManageAccountProps> = ({hideThisRef}) => {
  const regexFinal = /^.{6,30}$/;

  const {t} = useTranslation();

  const [
    requestPasswordChange,
    {data, error, isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useChangePasswordMutation();

  const [currentTask, setCurrentTask] = useState<
    'changePassword' | 'addNewTask'
  >('changePassword');

  const [{oldPassword, newPassword, confirmNewPassword}, setForm] =
    useState<ChangePasswordFormType>({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

  const handleChangeTask = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setCurrentTask(e.target.value as 'changePassword' | 'addNewTask');
  }, []);

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
      if (currentTask == 'changePassword') {
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    },
    [hideThisRef, currentTask]
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
  return (
    <div className="mx-2 flex items-center gap-1 w-[60rem]">
      <MaterialSymbolButton icon="manage_accounts" />
      <select
        onChange={handleChangeTask}
        className="max-w-xs select select-info select-xs"
        value={currentTask}
      >
        <option value="changePassword">
          {t('ManageAccount.select.changePassword')}
        </option>
        <option value="addNewTask">
          {t('ManageAccount.select.addNewTask')}
        </option>
      </select>
      {currentTask == 'changePassword' && (
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
      )}
      {currentTask == 'addNewTask' && <div>addNewTask</div>}
    </div>
  );
};

export default React.memo(ManageAccount);
