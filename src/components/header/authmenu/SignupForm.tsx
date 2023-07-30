import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import MaterialSymbolButton from '../../common/MaterialSymbolButton';
import {useTranslation} from 'react-i18next';
import {useSignupMutation, ResponseEntity} from '../../../app/api';

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
    {data, isUninitialized, isLoading, isSuccess, isError, reset}
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
    async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        e.stopPropagation();
        const signupRequest = {
          username: username,
          password: password
        };
        await requestSignup(signupRequest);
      } catch (err) {
        console.log(err);
      } finally {
        setForm({
          username: '',
          password: '',
          confirmPassword: ''
        });
      }
    },
    [username, password, requestSignup]
  );

  const onClickReset = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      reset();
      hideThisRef();
    },
    [hideThisRef, reset]
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
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={
              !regexFinal.test(username) ||
              !regexFinal.test(password) ||
              password != confirmPassword
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
      <div className="mx-2 flex items-center gap-1 w-full">
        <MaterialSymbolButton icon="person_add" />
        {isSuccess && (
          <div>
            Status : {(data as ResponseEntity).apiStatus}, Message :{' '}
            {(data as ResponseEntity).apiMsg}
          </div>
        )}
        {isError && <div>Signup Error!</div>}
        <button onClick={onClickReset} className="btn btn-xs btn-accent mx-1">
          {t('SignupForm.Reset')}
        </button>
      </div>
    );
  }
};

export default React.memo(SignupForm);
