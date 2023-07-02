import React from 'react';
import {MaterialSymbol} from 'react-material-symbols';

const AuthMenu = () => {
  return (
    <div className="dropdown dropdown-right">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <MaterialSymbol icon="account_circle" size={36} grade={-25} />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content z-50 card card-compact shadow bg-primary text-primary-content"
      >
        <div className="flex">
          <div className="btn btn-ghost btn-circle">
            <MaterialSymbol icon="account_circle" size={36} grade={-25} />
          </div>
          <div className="btn btn-ghost btn-circle">
            <MaterialSymbol icon="no_accounts" size={36} grade={-25} />
          </div>
          <div className="btn btn-ghost btn-circle">
            <MaterialSymbol icon="person_add" size={36} grade={-25} />
          </div>
          <div className="btn btn-ghost btn-circle">
            <MaterialSymbol icon="manage_accounts" size={36} grade={-25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthMenu);
