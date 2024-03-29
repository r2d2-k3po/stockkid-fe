import React, {FC} from 'react';
import LanguageSelect from './LanguageSelect';
import LightDarkSwap from './LightDarkSwap';
import Indicator from './Indicator';
import FixedPin from '../common/FixedPin';
import AuthMenu from './authmenu/AuthMenu';
import {GoogleOAuthProvider} from '@react-oauth/google';

export type HeaderProps = {
  fixedHeader: boolean;
  setFixedHeader: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: FC<HeaderProps> = ({fixedHeader, setFixedHeader}) => {
  const headerClassName = fixedHeader ? 'fixed top-0 left-0 right-0' : '';

  return (
    <div className={headerClassName}>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="navbar-start">
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_googleClientId as string}
          >
            <AuthMenu />
          </GoogleOAuthProvider>
        </div>

        <div className="navbar-center">
          <a className="text-xl normal-case btn btn-ghost">StockKid.net</a>
        </div>

        <div className="navbar-end">
          <Indicator />
          <LightDarkSwap />
          <LanguageSelect />
          <FixedPin fixed={fixedHeader} setFixed={setFixedHeader} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
