import React, {MouseEvent, useCallback, useRef} from 'react';
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

  return (
    <div className="dropdown dropdown-right">
      <label tabIndex={0}>
        {loggedIn ? (
          <MaterialSymbolButton icon="account_circle" />
        ) : (
          <MaterialSymbolButton icon="no_accounts" />
        )}
      </label>
      <div
        tabIndex={0}
        className="z-50 mx-1 shadow dropdown-content card card-compact bg-primary text-primary-content"
      >
        <div ref={visibleLoggedInButtonsRef} className="visible">
          {loggedIn ? (
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
          )}
        </div>
        <div ref={visibleLogoutFormRef} className="hidden">
          <LogoutForm />
        </div>
        <div ref={visibleManageAccountRef} className="hidden">
          <ManageAccount />
        </div>
        <div ref={visibleLoginFormRef} className="hidden">
          <LoginForm />
        </div>
        <div ref={visibleSignupFormRef} className="hidden">
          <SignupForm hideRef={hideRef(visibleSignupFormRef)} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthMenu);
