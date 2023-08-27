import React, {MouseEvent, useCallback, useEffect, useRef} from 'react';
import {
  naverCallbackUrl,
  naverClientId
} from '../../../app/constants/clientInfo';
import NaverButton from '../../common/NaverButton';

const NaverLogin = () => {
  const naverIdLoginRef = useRef<HTMLDivElement>(null);

  // const naver_id_login = useCallback(async (e: MouseEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  //
  //   // try {
  //   //
  //   // } catch (err) {
  //   //   console.log(err);
  //   // } finally {
  //   //
  //   // }
  // }, []);

  const handleClickNaverIdLogin = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      (naverIdLoginRef.current?.children[0] as HTMLElement).click();
    },
    []
  );

  useEffect(() => {
    const naver = (window as any).naver;
    const naverLogin = new naver.LoginWithNaverId({
      clientId: naverClientId,
      callbackUrl: naverCallbackUrl,
      isPopup: true,
      loginButton: {
        color: 'green', // 색상
        type: 3, // 버튼 크기
        height: '10' // 버튼 높이
      }
    });

    naverLogin.init();
  }, []);

  return (
    <>
      <div id="naverIdLogin" className="hidden" ref={naverIdLoginRef} />
      <div onClick={handleClickNaverIdLogin}>
        <NaverButton />
      </div>
    </>
  );
};

export default React.memo(NaverLogin);
