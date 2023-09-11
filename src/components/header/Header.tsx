import React, {FC, useEffect} from 'react';
import LanguageSelect from './LanguageSelect';
import LightDarkSwap from './LightDarkSwap';
import Indicator from './Indicator';
import Search from './Search';
import FixedPin from '../common/FixedPin';
import {useMeasure} from 'react-use';
import AuthMenu from './authmenu/AuthMenu';
import {GoogleOAuthProvider} from '@react-oauth/google';

export type HeaderProps = {
  fixedHeader: boolean;
  setFixedHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
};

const Header: FC<HeaderProps> = ({
  fixedHeader,
  setFixedHeader,
  setHeaderHeight
}) => {
  const [measureRef, {height}] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setHeaderHeight(height);
  }, [height, setHeaderHeight]);

  const headerClassName = fixedHeader ? 'fixed top-0 left-0 right-0' : '';

  return (
    <div ref={measureRef} className={headerClassName}>
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
          <Search />
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
