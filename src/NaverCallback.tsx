import React, {useEffect} from 'react';
import {useLoaderData} from 'react-router-dom';
import {useNaverSigninMutation} from './app/api';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from './app/hooks';
import {AuthState, updateTokens} from './app/slices/authSlice';

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
  const dispatch = useAppDispatch();

  const [requestNaverSignin, {isLoading, isError, reset}] =
    useNaverSigninMutation();

  const naverState = localStorage.getItem(
    'com.naver.nid.oauth.state_token'
  ) as string;

  const checkState = naverState === naverResponse.state;

  useEffect(() => {
    async function naverSignin() {
      const naverSigninRequest = {
        authcode: naverResponse.code,
        state: naverResponse.state
      };
      const data = await requestNaverSignin(naverSigninRequest).unwrap();
      const newTokens = data.apiObj as AuthState;
      dispatch(updateTokens(newTokens));
    }

    if (checkState) {
      try {
        naverSignin().then(() => window.close());
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    checkState,
    naverResponse.code,
    naverResponse.state,
    requestNaverSignin,
    dispatch
  ]);

  useEffect(() => {
    if (!checkState || isError) {
      const id = setTimeout(() => {
        if (isError) reset();
        window.close();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [checkState, isError, reset]);

  return (
    <>
      <div>Naver Login Callback</div>
      <div>code : {naverResponse.code}</div>
      <div>state : {naverResponse.state}</div>
      <div>{naverState}</div>
      <div>checkState : {checkState.toString()}</div>

      {isLoading && <div>requesting Naver sign in ...</div>}
      {(!checkState || isError) && <div>{t('AuthMenu.NaverLoginError')}</div>}
    </>
  );
};

export default React.memo(NaverCallback);
