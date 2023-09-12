import React, {MouseEvent, useCallback, useEffect, useState} from 'react';
import KakaoButton from '../../common/KakaoButton';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../app/hooks';
import {KakaoSigninRequest, useKakaoSigninMutation} from '../../../app/api';
import {AuthState, updateTokens} from '../../../app/slices/authSlice';
import {nanoid} from 'nanoid';

const KakaoLogin = () => {
  const [kakaoState, setKakaoState] = useState<string | null>(null);
  const [kakaoNonce, setKakaoNonce] = useState<string | null>(null);

  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [requestKakaoSignin, {isUninitialized, isSuccess, isError, reset}] =
    useKakaoSigninMutation();

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
      const data = await requestKakaoSignin(kakaoSigninRequest).unwrap();
      const newTokens = data.apiObj as AuthState;
      dispatch(updateTokens(newTokens));
    }

    if (isClicked) {
      const duration = 500;
      const id = setInterval(() => {
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
          clearInterval(id);
        }
      }, duration);
      return () => clearInterval(id);
    }
  }, [
    kakaoState,
    kakaoNonce,
    isClicked,
    isUninitialized,
    requestKakaoSignin,
    dispatch
  ]);

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        reset();
        setIsClicked(false);
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset]);

  return (
    <>
      <div onClick={handleClickKakaoLogin}>
        <KakaoButton />
      </div>
      {isError && <div>{t('AuthMenu.KakaoLoginError')}</div>}
    </>
  );
};

export default React.memo(KakaoLogin);
