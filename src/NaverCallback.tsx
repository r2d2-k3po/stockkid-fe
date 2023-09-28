import React, {useEffect} from 'react';
import {useLoaderData} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

type NaverResponse = {
  code: string;
  state: string;
};

export const loader = ({request}: {request: Request}) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  return {code: code, state: state} as NaverResponse;
};

const NaverCallback = () => {
  const naverResponse = useLoaderData() as NaverResponse;
  const {t} = useTranslation();

  const naverState = localStorage.getItem(
    'com.naver.nid.oauth.state_token'
  ) as string;

  const checkState = naverState === naverResponse.state;

  useEffect(() => {
    if (naverResponse.code && checkState) {
      localStorage.setItem('code', naverResponse.code);
      window.close();
    } else {
      localStorage.removeItem('code');
      const id = setTimeout(() => {
        window.close();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [naverResponse.code, checkState]);

  return (
    <>
      <div>Naver Login Callback</div>
      {(!naverResponse.code || !checkState) && (
        <div>{t('AuthMenu.NaverLoginError')}</div>
      )}
    </>
  );
};

export default React.memo(NaverCallback);
