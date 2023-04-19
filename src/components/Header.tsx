import React from 'react';
import LanguageSelect from './LanguageSelect';
import LightDarkSwap from './LightDarkSwap';
import Indicator from './Indicator';
import Search from './Search';
import DropDownMenu from './DropDownMenu';

export default function Header() {
  return (
    <div className="sticky top-0 navbar bg-base-100">
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
      </div>
    </div>
  );
}
