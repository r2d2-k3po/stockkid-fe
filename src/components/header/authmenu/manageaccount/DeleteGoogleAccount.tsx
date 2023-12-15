import React, {FC, MouseEvent, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDeleteGoogleAccountMutation} from '../../../../app/api';
import {useAppDispatch} from '../../../../app/hooks';
import {updateRefreshToken} from '../../../../app/slices/authSlice';
import GoogleButton from '../../../common/GoogleButton';
import {useGoogleLogin} from '@react-oauth/google';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';

type DeleteAccountProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteGoogleAccount: FC<DeleteAccountProps> = ({
  hideThisRef,
  setIsUninitialized,
  setIsLoading
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const [
    requestDeleteGoogleAccount,
    {isUninitialized, isLoading, isSuccess, isError, reset}
  ] = useDeleteGoogleAccountMutation();

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log('codeResponse.code : ' + codeResponse.code);
      try {
        const accountDeleteRequest = {
          authcode: codeResponse.code
        };
        await requestDeleteGoogleAccount(accountDeleteRequest);
      } catch (err) {
        console.log(err);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
    flow: 'auth-code'
  });

  useEffect(() => {
    setIsUninitialized(isUninitialized);
  }, [isUninitialized, setIsUninitialized]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        hideThisRef();
        if (isSuccess) {
          dispatch(updateRefreshToken(null));
        }
        reset();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef, dispatch]);

  if (isUninitialized || isLoading) {
    return (
      <div className="ml-1 flex items-center gap-1">
        <div className="flex items-center">
          <button
            disabled={isLoading}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('SignupForm.Cancel')}
          </button>
          <div onClick={() => googleLogin()}>
            <GoogleButton />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {isSuccess && <MaterialSymbolSuccess size={36} />}
        {isError && <MaterialSymbolError size={36} />}
      </>
    );
  }
};

export default React.memo(DeleteGoogleAccount);
