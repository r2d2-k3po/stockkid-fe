import React, {FC, MouseEvent, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../../app/hooks';
import {
  KakaoSigninRequest,
  useDeleteKakaoAccountMutation
} from '../../../../app/api';
import {updateRefreshToken} from '../../../../app/slices/authSlice';
import KakaoButton from '../../../common/KakaoButton';
import {nanoid} from 'nanoid';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';

type DeleteAccountProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteKakaoAccount: FC<DeleteAccountProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const [kakaoState, setKakaoState] = useState<string | null>(null);
  const [kakaoNonce, setKakaoNonce] = useState<string | null>(null);

  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [
    requestDeleteKakaoAccount,
    {isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useDeleteKakaoAccountMutation();

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

  const handleClickKakaoLogin = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_kakaoRestApiKey}&redirect_uri=${process.env.REACT_APP_kakaoCallbackUrl}&state=${kakaoState}&nonce=${kakaoNonce}`;
      setIsClicked(true);
      window.open(url, '', 'popup');
    },
    [kakaoState, kakaoNonce]
  );

  useEffect(() => {
    if (!kakaoState) {
      const id = nanoid();
      setKakaoState(id);
      localStorage.setItem('kakao.state', id as string);
    }
  }, [kakaoState]);

  useEffect(() => {
    if (!kakaoNonce) {
      const id = nanoid();
      setKakaoNonce(id);
      localStorage.setItem('kakao.nonce', id as string);
    }
  }, [kakaoNonce]);

  useEffect(() => {
    async function kakaoSignin(kakaoSigninRequest: KakaoSigninRequest) {
      await requestDeleteKakaoAccount(kakaoSigninRequest);
    }

    if (isClicked) {
      const duration = 500;
      const intervalId = setInterval(() => {
        if (isUninitialized) {
          const authcode = localStorage.getItem('code');
          if (authcode && kakaoState) {
            const kakaoSigninRequest = {
              authcode: authcode as string,
              nonce: kakaoNonce as string
            };
            try {
              kakaoSignin(kakaoSigninRequest);
            } catch (err) {
              console.log(err);
            } finally {
              localStorage.removeItem('code');
            }
          }
        } else {
          clearInterval(intervalId);
        }
      }, duration);
      const timeoutId = setTimeout(() => {
        reset();
        setIsClicked(false);
      }, 60000);
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [
    kakaoState,
    kakaoNonce,
    isClicked,
    isUninitialized,
    requestDeleteKakaoAccount,
    dispatch,
    reset
  ]);

  useEffect(() => {
    setIsUninitialized(isUninitialized);
  }, [isUninitialized, setIsUninitialized]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        hideThisRef();
        if (isSuccess) {
          dispatch(updateRefreshToken(null));
        }
        reset();
        setIsClicked(false);
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef, dispatch]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <div className="flex items-center">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <div onClick={handleClickKakaoLogin}>
            <KakaoButton />
          </div>
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

export default React.memo(DeleteKakaoAccount);
