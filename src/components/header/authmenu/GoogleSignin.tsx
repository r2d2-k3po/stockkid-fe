import React, {FC, MouseEvent, useCallback} from 'react';
import {ResponseEntity, useGoogleSigninMutation} from '../../../app/api';
import {updateToken} from '../../../app/slices/authSlice';
import {useAppDispatch} from '../../../app/hooks';
import GoogleButton from './GoogleButton';
import {useTranslation} from 'react-i18next';

type GoogleSigninProps = {
  idToken: string | null;
  hideThisRef: () => void;
};

const GoogleSignin: FC<GoogleSigninProps> = ({idToken, hideThisRef}) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const [
    requestGoogleSignin,
    {data, error, isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useGoogleSigninMutation();

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

  const onClickLogin = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      try {
        e.stopPropagation();
        console.log('idToken : ' + idToken);
        const googleSigninRequest = {
          authcode: idToken as string
        };
        const data = await requestGoogleSignin(googleSigninRequest).unwrap();
        const newToken = (data as ResponseEntity).apiObj as string;
        dispatch(updateToken(newToken));
        // console.log('googleSignin success, update token : ' + newToken);
      } catch (err) {
        console.log(err);
      }
    },
    [idToken, requestGoogleSignin, dispatch]
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
      <div className="mx-2 flex items-center gap-1 w-full">
        <GoogleButton />
        <div className="flex-none">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <button
            disabled={idToken == null}
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
        <GoogleButton />
        {isSuccess && (
          <div>
            Status : {(data as ResponseEntity).apiStatus}, Message :{' '}
            {(data as ResponseEntity).apiMsg}
          </div>
        )}
        {isError && <div>Login Error!</div>}
        <button onClick={onClickReset} className="btn btn-xs btn-accent mx-1">
          {t('SignupForm.Reset')}
        </button>
      </div>
    );
  }
};

export default React.memo(GoogleSignin);
