import React, {FC, MouseEvent, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {updateTokens} from '../../../app/slices/authSlice';
import MaterialSymbolButton from '../../common/MaterialSymbolButton';
import {useLogoutMutation} from '../../../app/api';
import MaterialSymbolSuccess from '../../common/MaterialSymbolSuccess';
import MaterialSymbolError from '../../common/MaterialSymbolError';

type LogoutFormProps = {
  hideThisRef: () => void;
};

const LogoutForm: FC<LogoutFormProps> = ({hideThisRef}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth);
  const [requestLogout, {isSuccess, isError, reset}] = useLogoutMutation();

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
    },
    [hideThisRef]
  );

  const onClickLogout = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await requestLogout(tokens);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(updateTokens({accessToken: null, refreshToken: null}));
      }
    },
    [tokens, requestLogout, dispatch]
  );

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        reset();
        hideThisRef();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, reset, hideThisRef]);

  return (
    <div className="mx-2 flex items-center gap-1">
      <button onClick={onClickCancel}>
        <MaterialSymbolButton icon="no_accounts" />
      </button>
      <div className="flex-none">
        <button
          disabled={isSuccess || isError}
          onClick={onClickCancel}
          className="btn btn-xs btn-ghost mr-1"
        >
          {t('SignupForm.Cancel')}
        </button>
        <button
          disabled={isSuccess || isError}
          onClick={onClickLogout}
          className="btn btn-xs btn-accent"
        >
          {t('LogoutForm.Logout')}
        </button>
      </div>
      {isSuccess && <MaterialSymbolSuccess size={36} />}
      {isError && <MaterialSymbolError size={36} />}
    </div>
  );
};

export default React.memo(LogoutForm);
