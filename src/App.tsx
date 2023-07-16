import React, {useEffect, useState} from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import {redirect} from 'react-router-dom';
import Main from './components/main/Main';

export const loader = ({request}: {request: Request}) => {
  const currentScreen = localStorage.getItem('currentScreen') || '1';
  if (new URL(request.url).pathname === '/') {
    return redirect(`/screen/${currentScreen}`);
  }
  return null;
};

export default function App() {
  const [fixedHeader, setFixedHeader] = useState<boolean>(
    (localStorage.getItem('fixedHeader') || 'true') === 'true'
  );

  const [headerHeight, setHeaderHeight] = useState<number>(64);

  const [fixedFooter, setFixedFooter] = useState<boolean>(
    (localStorage.getItem('fixedFooter') || 'true') === 'true'
  );

  const [footerHeight, setFooterHeight] = useState<number>(64);

  const classNameFixedHeader = `fixed top-[64px] left-0 right-0 bottom-0 overflow-auto`;

  const classNameFixedFooter = `fixed top-0 left-0 right-0 bottom-[64px] overflow-auto`;

  const classNameFixedBoth = `fixed top-[64px] left-0 right-0 bottom-[64px] overflow-auto`;

  useEffect(() => {
    localStorage.setItem('fixedHeader', fixedHeader.toString());
  }, [fixedHeader]);

  useEffect(() => {
    localStorage.setItem('fixedFooter', fixedFooter.toString());
  }, [fixedFooter]);

  if (fixedHeader && !fixedFooter) {
    return (
      <div className="relative">
        <Header
          fixedHeader={fixedHeader}
          setFixedHeader={setFixedHeader}
          setHeaderHeight={setHeaderHeight}
        />
        <div className={classNameFixedHeader}>
          <Main mainClassName="" />
          <Footer
            fixedFooter={fixedFooter}
            setFixedFooter={setFixedFooter}
            setFooterHeight={setFooterHeight}
          />
        </div>
      </div>
    );
  } else if (!fixedHeader && fixedFooter) {
    return (
      <div className="relative">
        <div className={classNameFixedFooter}>
          <Header
            fixedHeader={fixedHeader}
            setFixedHeader={setFixedHeader}
            setHeaderHeight={setHeaderHeight}
          />
          <Main mainClassName="" />
        </div>
        <Footer
          fixedFooter={fixedFooter}
          setFixedFooter={setFixedFooter}
          setFooterHeight={setFooterHeight}
        />
      </div>
    );
  } else {
    const appClassName = fixedHeader ? 'relative' : 'relative overflow-auto';

    const mainClassName = fixedHeader ? classNameFixedBoth : '';

    return (
      <div className={appClassName}>
        <Header
          fixedHeader={fixedHeader}
          setFixedHeader={setFixedHeader}
          setHeaderHeight={setHeaderHeight}
        />
        <Main mainClassName={mainClassName} />
        <Footer
          fixedFooter={fixedFooter}
          setFixedFooter={setFixedFooter}
          setFooterHeight={setFooterHeight}
        />
      </div>
    );
  }
}
