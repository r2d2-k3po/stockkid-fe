import React, {useEffect} from 'react';
import {useLoaderData} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

type KakaoResponse = {
  code: string;
  state: string;
};

export const loader = ({request}: {request: Request}) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  return {code: code, state: state} as KakaoResponse;
};

const KakaoCallback = () => {
  const kakaoResponse = useLoaderData() as KakaoResponse;
  const {t} = useTranslation();

  const kakaoState = localStorage.getItem('kakao.state') as string;

  const checkState = kakaoState === kakaoResponse.state;

  useEffect(() => {
    if (kakaoResponse.code && checkState) {
      localStorage.setItem('code', kakaoResponse.code);
      window.close();
    } else {
      localStorage.removeItem('code');
      const id = setTimeout(() => {
        window.close();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [kakaoResponse.code, checkState]);

  return (
    <>
      <div>Kakao Login Callback</div>
      {(!kakaoResponse.code || !checkState) && (
        <div>{t('AuthMenu.KakaoLoginError')}</div>
      )}
    </>
  );
};

export default React.memo(KakaoCallback);
