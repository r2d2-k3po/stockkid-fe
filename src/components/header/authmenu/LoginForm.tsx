import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useLoginMutation} from '../../../app/api';
import MaterialSymbolButton from '../../common/MaterialSymbolButton';
import {useAppDispatch} from '../../../app/hooks';
import {AuthState, updateTokens} from '../../../app/slices/authSlice';
import MaterialSymbolError from '../../common/MaterialSymbolError';

type LoginFormType = Record<'username' | 'password', string>;

type LoginFormProps = {
  hideThisRef: () => void;
};

const LoginForm: FC<LoginFormProps> = ({hideThisRef}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{6,30}$/;

  const [
    requestLogin,
    {isUninitialized, isLoading, isSuccess, isError, reset}
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
        const data = await requestLogin(loginRequest).unwrap();
        const newTokens = data.apiObj as AuthState;
        dispatch(updateTokens(newTokens));
      } catch (err) {
        console.log(err);
      } finally {
        setForm(({username}) => ({
          username: rememberMe ? username : '',
          password: ''
        }));
      }
    },
    [username, password, requestLogin, rememberMe, dispatch]
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
    if (isSuccess) {
      reset();
      hideThisRef();
    } else if (isError) {
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
          <MaterialSymbolButton icon="account_circle" />
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
        {isError && (
          <>
            <button onClick={onClickReset}>
              <MaterialSymbolButton icon="account_circle" />
            </button>
            <MaterialSymbolError size={36} />
          </>
        )}
      </div>
    );
  }
};

export default React.memo(LoginForm);
