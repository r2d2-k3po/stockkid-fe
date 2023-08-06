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
import {updateToken} from '../../../app/slices/authSlice';
import {GoogleOAuthProvider} from '@react-oauth/google';
import GoogleSignin from './GoogleSignin';
import {googleClientId} from '../../../app/constants/clientIds';

const AuthMenu = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  const loggedIn = !(token == null);
  // console.log('loggedin : ' + loggedIn);
  const decodedToken = useMemo(
    () => (token ? tokenDecoder(token) : null),
    [token]
  );
  // console.log('decodedToken : ' + JSON.stringify(decodedToken));

  const [expiresInMinutes, setExpiresInMinutes] = useState<number>(
    decodedToken
      ? getRemainingTimeBeforeExpiration(decodedToken?.exp as number)
      : 0
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
    if (token) {
      localStorage.setItem('token', token as string);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // update expiresInMinutes immediately after login
  useEffect(() => {
    if (decodedToken?.exp) {
      setExpiresInMinutes(
        getRemainingTimeBeforeExpiration(decodedToken.exp as number)
      );
    }
  }, [decodedToken?.exp]);

  // update expiresInMinutes in 1min after login and then every minute
  useEffect(() => {
    if (decodedToken?.exp) {
      const duration = 1000 * 60;
      const id = setInterval(() => {
        setExpiresInMinutes(
          getRemainingTimeBeforeExpiration(decodedToken.exp as number)
        );
      }, duration);
      return () => clearInterval(id);
    }
  }, [decodedToken?.exp]);

  useEffect(() => {
    if (token && expiresInMinutes === 0) {
      dispatch(updateToken(null));
    }
  }, [token, expiresInMinutes, dispatch]);

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
                  <p>{decodedToken?.sub} </p>
                  <p>{t('AuthMenu.expiresInMinutes', {expiresInMinutes})}</p>
                </div>
                <div onClick={showRef(visibleLogoutFormRef)}>
                  <MaterialSymbolButton icon="no_accounts" />
                </div>
                <div onClick={showRef(visibleManageAccountRef)}>
                  <MaterialSymbolButton icon="manage_accounts" />
                </div>
              </div>
            ) : (
              <div className="mx-2 flex">
                <div onClick={showRef(visibleLoginFormRef)}>
                  <MaterialSymbolButton icon="account_circle" />
                </div>
                <div onClick={showRef(visibleSignupFormRef)}>
                  <MaterialSymbolButton icon="person_add" />
                </div>
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleSignin />
                </GoogleOAuthProvider>
              </div>
            ))}
        </div>
        <div ref={visibleLogoutFormRef} className="hidden">
          <LogoutForm hideThisRef={hideRef(visibleLogoutFormRef)} />
        </div>
        <div ref={visibleManageAccountRef} className="hidden">
          <ManageAccount hideThisRef={hideRef(visibleManageAccountRef)} />
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
