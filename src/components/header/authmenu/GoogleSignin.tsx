import React, {useEffect} from 'react';
import GoogleButton from '../../common/GoogleButton';
import {useGoogleSigninMutation} from '../../../app/api';
import {useGoogleLogin} from '@react-oauth/google';
import {AuthState, updateTokens} from '../../../app/slices/authSlice';
import {useAppDispatch} from '../../../app/hooks';
import MaterialSymbolError from '../../common/MaterialSymbolError';

const GoogleSignin = () => {
  const dispatch = useAppDispatch();

  const [requestGoogleSignin, {isError, reset}] = useGoogleSigninMutation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      // console.log('codeResponse.code : ' + codeResponse.code);
      try {
        const googleSigninRequest = {
          authcode: codeResponse.code
        };
        const data = await requestGoogleSignin(googleSigninRequest).unwrap();
        const newTokens = data.apiObj as AuthState;
        dispatch(updateTokens(newTokens));
      } catch (err) {
        console.log(err);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
    flow: 'auth-code'
  });

  useEffect(() => {
    if (isError) {
      const id = setTimeout(() => {
        reset();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isError, reset]);

  return (
    <>
      <div onClick={() => googleLogin()}>
        <GoogleButton />
      </div>
      {isError && <MaterialSymbolError size={36} />}
    </>
  );
};

export default React.memo(GoogleSignin);
