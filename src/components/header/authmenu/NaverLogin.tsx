import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import NaverButton from '../../common/NaverButton';
import {AuthState, updateTokens} from '../../../app/slices/authSlice';
import {NaverSigninRequest, useNaverSigninMutation} from '../../../app/api';
import {useAppDispatch} from '../../../app/hooks';
import MaterialSymbolError from '../../common/MaterialSymbolError';

const NaverLogin = () => {
  const dispatch = useAppDispatch();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const naverIdLoginRef = useRef<HTMLDivElement>(null);

  const [requestNaverSignin, {isUninitialized, isSuccess, isError, reset}] =
    useNaverSigninMutation();

  const handleClickNaverIdLogin = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      (naverIdLoginRef.current?.children[0] as HTMLElement).click();
      setIsClicked(true);
    },
    []
  );

  useEffect(() => {
    const naverLogin = new (window as any).naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_naverClientId,
      callbackUrl: process.env.REACT_APP_naverCallbackUrl,
      isPopup: true,
      loginButton: {
        color: 'green', // 색상
        type: 3, // 버튼 크기
        height: '10' // 버튼 높이
      }
    });

    naverLogin.init();
  }, []);

  useEffect(() => {
    async function naverSignin(naverSigninRequest: NaverSigninRequest) {
      const data = await requestNaverSignin(naverSigninRequest).unwrap();
      const newTokens = data.apiObj as AuthState;
      dispatch(updateTokens(newTokens));
    }

    if (isClicked) {
      const duration = 500;
      const intervalId = setInterval(() => {
        if (isUninitialized) {
          const authcode = localStorage.getItem('code');
          const naverState = localStorage.getItem(
            'com.naver.nid.oauth.state_token'
          );
          if (authcode && naverState) {
            const naverSigninRequest = {
              authcode: authcode as string,
              state: naverState as string
            };
            try {
              void naverSignin(naverSigninRequest);
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
  }, [isClicked, isUninitialized, requestNaverSignin, dispatch, reset]);

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
      <div id="naverIdLogin" className="hidden" ref={naverIdLoginRef} />
      <div onClick={handleClickNaverIdLogin}>
        <NaverButton />
      </div>
      {isError && <MaterialSymbolError size={36} />}
    </>
  );
};

export default React.memo(NaverLogin);
