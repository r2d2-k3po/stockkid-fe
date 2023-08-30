import React from 'react';

const NaverButton = () => {
  return (
    <div className="btn btn-ghost btn-circle">
      <img
        className="w-7 h-7"
        src="/img/btnG_icon_circle.png"
        alt="naver logo"
      />
    </div>
  );
};

export default React.memo(NaverButton);
