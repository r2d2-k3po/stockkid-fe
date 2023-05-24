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

  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [fixedFooter, setFixedFooter] = useState<boolean>(
    (localStorage.getItem('fixedFooter') || 'true') === 'true'
  );

  const [footerHeight, setFooterHeight] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('fixedHeader', fixedHeader.toString());
  }, [fixedHeader]);

  useEffect(() => {
    localStorage.setItem('fixedFooter', fixedFooter.toString());
  }, [fixedFooter]);

  if (fixedHeader && !fixedFooter) {
    return (
      <div className="relative h-full min-h-screen">
        <Header
          fixedHeader={fixedHeader}
          setFixedHeader={setFixedHeader}
          setHeaderHeight={setHeaderHeight}
        />
        <div
          className={`absolute top-[${headerHeight}px] left-0 right-0 bottom-0 overflow-auto`}
        >
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
      <div className="relative h-full min-h-screen">
        <div
          className={`absolute top-0 left-0 right-0 bottom-[${footerHeight}px] overflow-auto`}
        >
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
    const appClassName = fixedHeader
      ? 'relative h-auto min-h-screen'
      : 'relative h-auto min-h-screen overflow-auto';

    const mainClassName = fixedHeader
      ? `absolute top-[${headerHeight}px] left-0 right-0 bottom-[${footerHeight}px] overflow-auto`
      : '';

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
