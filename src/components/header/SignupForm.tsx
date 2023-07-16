import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import MaterialSymbolButton from '../common/MaterialSymbolButton';
import {useTranslation} from 'react-i18next';
import {useSignupMutation} from '../../app/api';

type SignupFormType = Record<
  'username' | 'password' | 'confirmPassword',
  string
>;

type SignupFormProps = {
  hideThisRef: () => void;
};

const SignupForm: FC<SignupFormProps> = ({hideThisRef}) => {
  const regexFinal = /^.{6,30}$/;

  const {t} = useTranslation();

  const [
    requestSignup,
    {data, error, isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useSignupMutation();

  const [{username, password, confirmPassword}, setForm] =
    useState<SignupFormType>({
      username: '',
      password: '',
      confirmPassword: ''
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
        username: '',
        password: '',
        confirmPassword: ''
      });
    },
    [hideThisRef]
  );

  const onClickSignup = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const signupRequest = {
        username: username,
        password: password
      };
      requestSignup(signupRequest);
      // hideThisRef();
      setForm({
        username: '',
        password: '',
        confirmPassword: ''
      });
      reset();
    },
    [username, password, requestSignup, reset]
  );

  if (isUninitialized || isLoading) {
    return (
      <div className="mx-2 flex items-center gap-1 w-[50rem]">
        <MaterialSymbolButton icon="person_add" />
        <input
          type="text"
          name="username"
          placeholder={t('SignupForm.placeholder.username') as string}
          value={username}
          onChange={handleChange('username')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <input
          type="password"
          name="password"
          placeholder={t('SignupForm.placeholder.password') as string}
          value={password}
          onChange={handleChange('password')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder={t('SignupForm.placeholder.confirmPassword') as string}
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full max-w-xs input input-bordered input-sm"
        />
        <div className="flex-none">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={
              !regexFinal.test(username) ||
              !regexFinal.test(password) ||
              password != confirmPassword ||
              isLoading
            }
            onClick={onClickSignup}
            className={
              isLoading
                ? 'btn btn-xs btn-accent loading'
                : 'btn btn-xs btn-accent'
            }
          >
            {t('SignupForm.Signup')}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-2 flex items-center gap-1 w-[50rem]">
        <MaterialSymbolButton icon="person_add" />
        {isSuccess && <div>Success : {JSON.stringify(data)}</div>}
        {isError && <div>Error : {JSON.stringify(error)} </div>}
      </div>
    );
  }
};

export default React.memo(SignupForm);
