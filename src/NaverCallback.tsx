import React from 'react';
import {useLoaderData} from 'react-router-dom';

type NaverResponse = {
  code: string;
  state: string;
};

export const loader = ({request}: {request: Request}) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  return {code: code, state: state} as NaverResponse;
};

const NaverCallback = () => {
  const naverResponse = useLoaderData() as NaverResponse;

  return (
    <>
      <div>Naver Callback</div>
      <div>code : {naverResponse.code}</div>
      <div>state : {naverResponse.state}</div>
    </>
  );
};

export default React.memo(NaverCallback);
