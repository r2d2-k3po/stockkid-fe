import React, {useRef} from 'react';
import LanguageSelect from './LanguageSelect';
import LightDarkSwap from './LightDarkSwap';
import Indicator from './Indicator';
import Search from './Search';
import DropDownMenu from './DropDownMenu';
import StickyPin from './StickyPin';

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);

  const stickyPosition = 'top-0';

  return (
    <div ref={headerRef}>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <DropDownMenu />
        </div>

        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl">StockKid</a>
        </div>

        <div className="navbar-end">
          <Search />
          <Indicator />
          <LightDarkSwap />
          <LanguageSelect />
          <StickyPin targetRef={headerRef} stickyPosition={stickyPosition} />
        </div>
      </div>
    </div>
  );
}
