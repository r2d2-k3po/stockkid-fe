import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import MaterialSymbolButton from '../../common/MaterialSymbolButton';
import LogoutForm from './LogoutForm';
import ManageAccount from './manageaccount/ManageAccount';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {visibleRefHiddenRef} from '../../../utils/visibleRefHiddenRef';
import {useTranslation} from 'react-i18next';
import {
  getRemainingTimeBeforeExpiration,
  tokenDecoder
} from '../../../utils/tokenDecoder';
import {updateRefreshToken} from '../../../app/slices/authSlice';
import GoogleSignin from './GoogleSignin';
import NaverLogin from './NaverLogin';
import KakaoLogin from './KakaoLogin';

const AuthMenu = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth);
  const loggedIn = !(tokens.refreshToken == null);

  const decodedRefreshToken = useMemo(
    () => (tokens.refreshToken ? tokenDecoder(tokens.refreshToken) : null),
    [tokens.refreshToken]
  );

  const loginMethod = useMemo(
    () => (decodedRefreshToken ? (decodedRefreshToken.soc as string) : null),
    [decodedRefreshToken]
  );

  const [expiresInMinutesRefresh, setExpiresInMinutesRefresh] =
    useState<number>(
      decodedRefreshToken
        ? getRemainingTimeBeforeExpiration(decodedRefreshToken?.exp as number)
        : 10080
    );

  const visibleLoggedInButtonsRef = useRef<HTMLDivElement>(null);
  const visibleLogoutFormRef = useRef<HTMLDivElement>(null);
  const visibleManageAccountRef = useRef<HTMLDivElement>(null);
  const visibleLoginFormRef = useRef<HTMLDivElement>(null);
  const visibleSignupFormRef = useRef<HTMLDivElement>(null);

  const showRef = useCallback(
    (ref: React.RefObject<HTMLDivElement>) =>
      (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        visibleRefHiddenRef(ref, visibleLoggedInButtonsRef);
      },
    []
  );

  const hideRef = useCallback(
    (ref: React.RefObject<HTMLDivElement>) => () => {
      visibleRefHiddenRef(visibleLoggedInButtonsRef, ref);
    },
    []
  );

  const [showLoggedInButtons, setShowLoggedInButtons] =
    useState<boolean>(false);

  const toggleShowLoggedInButtons = useCallback(
    () => setShowLoggedInButtons((showLoggedInButtons) => !showLoggedInButtons),
    []
  );

  useEffect(() => {
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken as string);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [tokens.refreshToken]);

  // update expiresInMinutesRefresh immediately after refreshing tokens
  useEffect(() => {
    if (decodedRefreshToken?.exp) {
      setExpiresInMinutesRefresh(
        getRemainingTimeBeforeExpiration(decodedRefreshToken.exp as number)
      );
    }
  }, [decodedRefreshToken?.exp]);

  // update expiresInMinutes in 1min after refreshing tokens and then every minute
  useEffect(() => {
    if (decodedRefreshToken?.exp) {
      const duration = 1000 * 60;
      const id = setInterval(() => {
        const remainingTime = getRemainingTimeBeforeExpiration(
          decodedRefreshToken.exp as number
        );
        setExpiresInMinutesRefresh(remainingTime);
        if (remainingTime == 0) {
          dispatch(updateRefreshToken(null));
        }
      }, duration);
      return () => clearInterval(id);
    }
  }, [decodedRefreshToken?.exp, dispatch]);

  return (
    <div className="flex">
      <div onClick={toggleShowLoggedInButtons}>
        {loggedIn ? (
          <div className="shadow card card-compact bg-accent text-accent-content">
            <MaterialSymbolButton icon="account_circle" />
          </div>
        ) : (
          <MaterialSymbolButton icon="no_accounts" />
        )}
      </div>
      <div className="z-50 mx-1 shadow card card-compact bg-primary text-primary-content">
        <div ref={visibleLoggedInButtonsRef} className="visible">
          {showLoggedInButtons &&
            (loggedIn ? (
              <div className="mx-2 flex">
                <div className="m-1 mr-2 card card-compact bg-accent text-accent-content text-xs py-1 px-2">
                  <p>{decodedRefreshToken?.sub} </p>
                  <p>
                    {t('AuthMenu.expiresInMinutes', {expiresInMinutesRefresh})}
                  </p>
                </div>
                <div onClick={showRef(visibleLogoutFormRef)}>
                  <MaterialSymbolButton icon="no_accounts" />
                </div>
                <div onClick={showRef(visibleManageAccountRef)}>
                  <MaterialSymbolButton icon="manage_accounts" />
                </div>
              </div>
            ) : (
              <div className="mx-2 flex items-center">
                <div onClick={showRef(visibleLoginFormRef)}>
                  <MaterialSymbolButton icon="account_circle" />
                </div>
                <div onClick={showRef(visibleSignupFormRef)}>
                  <MaterialSymbolButton icon="person_add" />
                </div>
                <div onClick={showRef(visibleManageAccountRef)}>
                  <MaterialSymbolButton icon="manage_accounts" />
                </div>
                <GoogleSignin />
                <NaverLogin />
                <KakaoLogin />
              </div>
            ))}
        </div>
        <div ref={visibleLogoutFormRef} className="hidden">
          <LogoutForm hideThisRef={hideRef(visibleLogoutFormRef)} />
        </div>
        <div ref={visibleManageAccountRef} className="hidden">
          <ManageAccount
            loginMethod={loginMethod}
            hideThisRef={hideRef(visibleManageAccountRef)}
          />
        </div>
        <div ref={visibleLoginFormRef} className="hidden">
          <LoginForm hideThisRef={hideRef(visibleLoginFormRef)} />
        </div>
        <div ref={visibleSignupFormRef} className="hidden">
          <SignupForm hideThisRef={hideRef(visibleSignupFormRef)} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthMenu);
