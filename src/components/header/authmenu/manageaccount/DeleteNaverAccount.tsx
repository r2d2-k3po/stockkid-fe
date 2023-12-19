import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '../../../../app/hooks';
import {
  NaverSigninRequest,
  useDeleteNaverAccountMutation
} from '../../../../app/api';
import {updateTokens} from '../../../../app/slices/authSlice';
import NaverButton from '../../../common/NaverButton';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';

type DeleteAccountProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteNaverAccount: FC<DeleteAccountProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const naverIdLoginRef = useRef<HTMLDivElement>(null);

  const [
    requestDeleteNaverAccount,
    {isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useDeleteNaverAccountMutation();

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

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
      await requestDeleteNaverAccount(naverSigninRequest);
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
              naverSignin(naverSigninRequest);
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
  }, [isClicked, isUninitialized, requestDeleteNaverAccount, dispatch, reset]);

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
          dispatch(updateTokens({accessToken: null, refreshToken: null}));
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
          <div id="naverIdLogin" className="hidden" ref={naverIdLoginRef} />
          <div onClick={handleClickNaverIdLogin}>
            <NaverButton />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {isSuccess && <MaterialSymbolSuccess size={36} />}
        {isError && <MaterialSymbolError size={36} />}
      </>
    );
  }
};

export default React.memo(DeleteNaverAccount);
