import React from 'react';

const KakaoButton = () => {
  return (
    <div className="btn btn-ghost btn-circle">
      <img className="w-8 h-8" src="/img/kakao.png" alt="kakao logo" />
    </div>
  );
};

export default React.memo(KakaoButton);
