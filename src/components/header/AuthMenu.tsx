import React from 'react';
import {useAppSelector} from '../../app/hooks';
import MaterialSymbolButton from '../common/MaterialSymbolButton';

const AuthMenu = () => {
  const token = useAppSelector((state) => state.auth.token);
  const loggedIn = !(token == null);

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
        className="dropdown-content z-50 card card-compact shadow bg-primary text-primary-content"
      >
        {loggedIn ? (
          <div className="flex">
            <MaterialSymbolButton icon="no_accounts" />
            <MaterialSymbolButton icon="manage_accounts" />
          </div>
        ) : (
          <div className="flex">
            <MaterialSymbolButton icon="account_circle" />
            <MaterialSymbolButton icon="person_add" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AuthMenu);
