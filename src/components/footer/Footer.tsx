import React, {FC, useEffect} from 'react';
import FixedPin from '../common/FixedPin';
import {useMeasure} from 'react-use';

export type FooterProps = {
  fixedFooter: boolean;
  setFixedFooter: React.Dispatch<React.SetStateAction<boolean>>;
  setFooterHeight: React.Dispatch<React.SetStateAction<number>>;
};

const Footer: FC<FooterProps> = ({
  fixedFooter,
  setFixedFooter,
  setFooterHeight
}) => {
  const [measureRef, {height}] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    setFooterHeight(height);
  }, [height, setFooterHeight]);

  const footerClassName = fixedFooter ? 'fixed left-0 right-0 bottom-0' : '';

  return (
    <div ref={measureRef} className={footerClassName}>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="navbar-start">
          <div>Copyright © 2023 - All rights reserved</div>
        </div>

        <div className="navbar-center">
          <a className="text-xl normal-case btn btn-ghost">StockKid.net</a>
        </div>

        <div className="navbar-end">
          <FixedPin fixed={fixedFooter} setFixed={setFixedFooter} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Footer);
