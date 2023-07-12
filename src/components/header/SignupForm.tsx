import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import MaterialSymbolButton from '../common/MaterialSymbolButton';
import {useTranslation} from 'react-i18next';

type SignupFormType = Record<
  'username' | 'password' | 'confirmPassword',
  string
>;

type SignupFormProps = {
  hideRef: () => void;
};

const SignupForm: FC<SignupFormProps> = ({hideRef}) => {
  const {t} = useTranslation();

  const [{username, password, confirmPassword}, setForm] =
    useState<SignupFormType>({
      username: '',
      password: '',
      confirmPassword: ''
    });

  const handleChange = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((obj) => ({...obj, [key]: e.target.value.trim()}));
    },
    []
  );

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideRef();
      setForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
    },
    [hideRef]
  );

  const onClickSignup = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideRef();
      setForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
    },
    [hideRef]
  );

  return (
    <div className="flex w-[50rem] gap-1 items-center mx-2">
      <MaterialSymbolButton icon="person_add" />
      <input
        type="text"
        name="username"
        placeholder={t('SignupForm.placeholder.username') as string}
        value={username}
        onChange={handleChange('username')}
        className="input input-bordered input-sm w-full max-w-xs"
      />
      <input
        type="password"
        name="password"
        placeholder={t('SignupForm.placeholder.password') as string}
        value={password}
        onChange={handleChange('password')}
        className="input input-bordered input-sm w-full max-w-xs"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder={t('SignupForm.placeholder.confirmPassword') as string}
        value={confirmPassword}
        onChange={handleChange('confirmPassword')}
        className="input input-bordered input-sm w-full max-w-xs"
      />
      <div className="flex-none">
        <button onClick={onClickCancel} className="btn btn-xs btn-ghost">
          {t('SignupForm.Cancel')}
        </button>
        <button
          disabled={
            username.length <= 5 ||
            password.length <= 5 ||
            password != confirmPassword
          }
          onClick={onClickSignup}
          className="btn btn-xs btn-accent"
        >
          {t('SignupForm.Signup')}
        </button>
      </div>
    </div>
  );
};

export default React.memo(SignupForm);
