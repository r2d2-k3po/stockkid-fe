import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {useAppSelector} from '../../app/hooks';
import MaterialSymbolButton from '../common/MaterialSymbolButton';
import LogoutForm from './LogoutForm';
import ManageAccount from './ManageAccount';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {visibleRefHiddenRef} from '../../utils/visibleRefHiddenRef';

const AuthMenu = () => {
  const token = useAppSelector((state) => state.auth.token);
  const loggedIn = !(token == null);
  // console.log('loggedin : ' + loggedIn);

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
              </div>
            ))}
        </div>
        <div ref={visibleLogoutFormRef} className="hidden">
          <LogoutForm />
        </div>
        <div ref={visibleManageAccountRef} className="hidden">
          <ManageAccount />
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
