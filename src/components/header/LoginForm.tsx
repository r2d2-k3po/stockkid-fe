import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {ResponseEntity, useLoginMutation} from '../../app/api';
import MaterialSymbolButton from '../common/MaterialSymbolButton';

type LoginFormType = Record<'username' | 'password', string>;

type LoginFormProps = {
  hideThisRef: () => void;
};

const LoginForm: FC<LoginFormProps> = ({hideThisRef}) => {
  const regexFinal = /^.{6,30}$/;

  const {t} = useTranslation();

  const [
    requestLogin,
    {data, error, isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useLoginMutation();

  const [{username, password}, setForm] = useState<LoginFormType>({
    username: localStorage.getItem('username') ?? '',
    password: ''
  });

  const [rememberMe, setRememberMe] = useState<boolean>(
    (localStorage.getItem('rememberMe') || 'false') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('rememberMe', rememberMe.toString());
  }, [rememberMe]);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [rememberMe, username]);

  const handleChange = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        setForm((obj) => ({...obj, [key]: e.target.value.trim()}));
      }
    },
    []
  );

  const handleChangeChecked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setRememberMe(e.target.checked);
    },
    []
  );

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
      setForm(({username}) => ({
        username: rememberMe ? username : '',
        password: ''
      }));
    },
    [hideThisRef, rememberMe]
  );

  const onClickLogin = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        e.stopPropagation();
        const loginRequest = {
          username: username,
          password: password
        };
        await requestLogin(loginRequest);
      } catch (err) {
        console.log(err);
      } finally {
        setForm(({username}) => ({
          username: rememberMe ? username : '',
          password: ''
        }));
      }
    },
    [username, password, requestLogin, rememberMe]
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
        <MaterialSymbolButton icon="account_circle" />
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
        <div className="form-control btn btn-ghost btn-sm">
          <label className="label cursor-pointer">
            <div className="label-text text-xs w-16">
              {t('LoginForm.RememberMe')}
            </div>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleChangeChecked}
              className="checkbox checkbox-warning checkbox-xs mt-1 ml-2"
            />
          </label>
        </div>
        <div className="flex-none">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={!regexFinal.test(username) || !regexFinal.test(password)}
            onClick={onClickLogin}
            className={
              isLoading
                ? 'btn btn-xs btn-accent loading'
                : 'btn btn-xs btn-accent'
            }
          >
            {t('LoginForm.Login')}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-2 flex items-center gap-1 w-full">
        <MaterialSymbolButton icon="account_circle" />
        {isSuccess && (
          <div>
            Status : {(data as ResponseEntity).responseStatus}, Message :{' '}
            {(data as ResponseEntity).responseMessage}
          </div>
        )}
        {/*{isError && <div>Login Error!</div>}*/}
        {isError && <div>{JSON.stringify(error)}</div>}
        <button onClick={onClickReset} className="btn btn-xs btn-accent mx-1">
          {t('SignupForm.Reset')}
        </button>
      </div>
    );
  }
};

export default React.memo(LoginForm);
