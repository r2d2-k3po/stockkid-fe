import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import MaterialSymbolButton from '../../common/MaterialSymbolButton';
import {useTranslation} from 'react-i18next';
import {useSignupMutation} from '../../../app/api';
import MaterialSymbolError from '../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../common/MaterialSymbolSuccess';

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
    {isUninitialized, isLoading, isSuccess, isError, reset}
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
      <div className="mx-2 flex items-center gap-1 w-[50rem]">
        <button onClick={onClickCancel}>
          <MaterialSymbolButton icon="person_add" />
        </button>
        <input
          type="text"
          name="username"
          placeholder={t('SignupForm.placeholder.username') as string}
          value={username}
          onChange={handleChange('username')}
          className="w-full max-w-xs input input-bordered input-sm text-accent-content"
        />
        <input
          type="password"
          name="password"
          placeholder={t('SignupForm.placeholder.password') as string}
          value={password}
          onChange={handleChange('password')}
          className="w-full max-w-xs input input-bordered input-sm text-accent-content"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder={t('SignupForm.placeholder.confirmPassword') as string}
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          className="w-full max-w-xs input input-bordered input-sm text-accent-content"
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
        <button onClick={onClickReset}>
          <MaterialSymbolButton icon="person_add" />
        </button>
        {isSuccess && <MaterialSymbolSuccess />}
        {isError && <MaterialSymbolError />}
      </div>
    );
  }
};

export default React.memo(SignupForm);
