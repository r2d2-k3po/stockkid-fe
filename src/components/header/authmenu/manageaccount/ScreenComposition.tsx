import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {
  useLoadScreenSettingMutation,
  useLoadScreenSettingDefaultMutation,
  useLazyLoadScreenTitlesDefaultQuery,
  useLazyLoadScreenTitlesQuery,
  useSaveScreenCompositionMutation
} from '../../../../app/api';
import {loadScreens} from '../../../../app/slices/screensSlice';
import {EntityState} from '@reduxjs/toolkit';
import {Panel} from '../../../../app/slices/panelsSlice';
import {Screen} from '../../../../app/slices/screensSlice';
import {useNavigate} from 'react-router-dom';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';

interface ScreenSetting {
  screens: EntityState<Screen>;
  panels: EntityState<Panel>;
}

interface ScreenSettingLoad {
  screenSetting: string;
}

interface ScreenTitles {
  screenTitle1: string;
  screenTitle2: string;
  screenTitle3: string;

  [key: string]: string;
}

type ScreenCompositionProps = {
  hideThisRef: () => void;
  setIsUninitialized: React.Dispatch<React.SetStateAction<boolean>>;
};

const ScreenComposition: FC<ScreenCompositionProps> = ({
  hideThisRef,
  setIsUninitialized
}) => {
  const {t} = useTranslation();
  const regexFinal = /^.{1,20}$/;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth);
  const loggedIn = !(tokens.refreshToken == null);

  const screens = useAppSelector((state) => state.screens);
  const panels = useAppSelector((state) => state.panels);

  const [
    requestScreenCompositionSave,
    {
      isLoading: isLoadingSave,
      isSuccess: isSuccessSave,
      isError: isErrorSave,
      reset: resetSave
    }
  ] = useSaveScreenCompositionMutation();
  const [
    requestScreenSettingLoad,
    {
      isLoading: isLoadingLoad,
      isSuccess: isSuccessLoad,
      isError: isErrorLoad,
      reset: resetLoad
    }
  ] = useLoadScreenSettingMutation();
  const [
    requestScreenSettingDefaultLoad,
    {
      isLoading: isLoadingDefaultLoad,
      isSuccess: isSuccessDefaultLoad,
      isError: isErrorDefaultLoad,
      reset: resetDefaultLoad
    }
  ] = useLoadScreenSettingDefaultMutation();
  const [requestScreenTitlesLoad, {data: dataScreenTitles}] =
    useLazyLoadScreenTitlesQuery();
  const [requestScreenTitlesDefaultLoad, {data: dataScreenTitlesDefault}] =
    useLazyLoadScreenTitlesDefaultQuery();

  const [currentTask, setCurrentTask] = useState<'save' | 'load'>('save');

  const [currentTarget, setCurrentTarget] = useState<
    'localStorage' | 'server' | 'serverDefault'
  >('localStorage');

  const [currentNumber, setCurrentNumber] = useState<'1' | '2' | '3'>('1');

  const [currentTitle, setCurrentTitle] = useState<string>('');

  const [loadedTitle, setLoadedTitle] = useState<string>('');

  const [isSuccessLocal, setIsSuccessLocal] = useState<boolean>(false);

  const handleChangeTask = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setCurrentTask(e.target.value as 'save' | 'load');
    setCurrentTarget('localStorage');
  }, []);

  const handleChangeTarget = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setCurrentTarget(
        e.target.value as 'localStorage' | 'server' | 'serverDefault'
      );
    },
    []
  );

  const handleChangeNumber = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setCurrentNumber(e.target.value as '1' | '2' | '3');
    },
    []
  );

  const handleChangeTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^.{0,20}$/;
    if (regex.test(e.target.value)) {
      setCurrentTitle(e.target.value.trim());
    }
  }, []);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      hideThisRef();
      setCurrentTitle('');
    },
    [hideThisRef]
  );

  const onClickHandleTask = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        const key = 'screenSetting' + currentNumber;
        if (currentTask == 'save') {
          const screenSetting = {
            screens: screens,
            panels: panels
          };
          if (currentTarget == 'localStorage') {
            localStorage.setItem('screenTitle' + currentNumber, currentTitle);
            localStorage.setItem(key, JSON.stringify(screenSetting));
            setIsSuccessLocal(true);
          } else if (currentTarget == 'server') {
            const screenCompositionSaveRequest = {
              number: currentNumber,
              screenTitle: currentTitle,
              screenSetting: JSON.stringify(screenSetting)
            };
            await requestScreenCompositionSave(screenCompositionSaveRequest);
          }
        } else if (currentTask == 'load') {
          if (currentTarget == 'localStorage') {
            if (localStorage.getItem(key)) {
              const screenSetting = JSON.parse(
                localStorage.getItem(key) as string
              ) as ScreenSetting;
              dispatch(loadScreens(screenSetting));
            }
          } else if (currentTarget == 'server') {
            const data = await requestScreenSettingLoad(currentNumber).unwrap();
            const screenSetting = JSON.parse(
              (data.apiObj as ScreenSettingLoad).screenSetting
            ) as ScreenSetting;
            dispatch(loadScreens(screenSetting));
          } else if (currentTarget == 'serverDefault') {
            const data = await requestScreenSettingDefaultLoad(
              currentNumber
            ).unwrap();
            const screenSetting = JSON.parse(
              (data.apiObj as ScreenSettingLoad).screenSetting
            ) as ScreenSetting;
            dispatch(loadScreens(screenSetting));
          }
          navigate('screen/1');
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      currentTask,
      currentTarget,
      currentNumber,
      currentTitle,
      screens,
      panels,
      requestScreenCompositionSave,
      requestScreenSettingLoad,
      requestScreenSettingDefaultLoad,
      dispatch,
      navigate
    ]
  );

  useEffect(() => {
    async function loadScreenTitles() {
      if (loggedIn) await requestScreenTitlesLoad();
      await requestScreenTitlesDefaultLoad();
    }

    if (currentTask == 'load') {
      try {
        void loadScreenTitles();
      } catch (err) {
        console.log(err);
      }
    }
  }, [
    loggedIn,
    currentTask,
    requestScreenTitlesLoad,
    requestScreenTitlesDefaultLoad
  ]);

  useEffect(() => {
    if (currentTask == 'load') {
      if (currentTarget == 'localStorage') {
        setLoadedTitle(
          localStorage.getItem('screenTitle' + currentNumber)
            ? (localStorage.getItem('screenTitle' + currentNumber) as string)
            : ''
        );
      } else if (currentTarget == 'server') {
        setLoadedTitle(
          (dataScreenTitles?.apiObj as ScreenTitles)[
            'screenTitle' + currentNumber
          ]
            ? (dataScreenTitles?.apiObj as ScreenTitles)[
                'screenTitle' + currentNumber
              ]
            : ''
        );
      } else if (currentTarget == 'serverDefault') {
        setLoadedTitle(
          (dataScreenTitlesDefault?.apiObj as ScreenTitles)[
            'screenTitle' + currentNumber
          ]
            ? (dataScreenTitlesDefault?.apiObj as ScreenTitles)[
                'screenTitle' + currentNumber
              ]
            : ''
        );
      }
    }
  }, [
    currentTask,
    currentTarget,
    currentNumber,
    dataScreenTitles,
    dataScreenTitlesDefault
  ]);

  useEffect(() => {
    setIsUninitialized(true);
  }, [setIsUninitialized]);

  useEffect(() => {
    if (isSuccessLocal) {
      const id = setTimeout(() => {
        setIsSuccessLocal(false);
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccessLocal]);

  useEffect(() => {
    if (isSuccessSave || isErrorSave) {
      const id = setTimeout(() => {
        resetSave();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccessSave, isErrorSave, resetSave]);

  useEffect(() => {
    if (isSuccessLoad || isErrorLoad) {
      const id = setTimeout(() => {
        resetLoad();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccessLoad, isErrorLoad, resetLoad]);

  useEffect(() => {
    if (isSuccessDefaultLoad || isErrorDefaultLoad) {
      const id = setTimeout(() => {
        resetDefaultLoad();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccessDefaultLoad, isErrorDefaultLoad, resetDefaultLoad]);

  return (
    <div className="ml-1 flex items-center gap-1">
      <select
        onChange={handleChangeTask}
        className="max-w-xs select select-info select-xs text-accent-content"
        value={currentTask}
      >
        <option value="save">{t('ScreenComposition.selectTask.save')}</option>
        <option value="load">{t('ScreenComposition.selectTask.load')}</option>
      </select>
      <select
        onChange={handleChangeTarget}
        className="max-w-xs select select-info select-xs text-accent-content"
        value={currentTarget}
      >
        <option value="localStorage">
          {t('ScreenComposition.selectTarget.localStorage')}
        </option>
        {loggedIn && (
          <option value="server">
            {t('ScreenComposition.selectTarget.server')}
          </option>
        )}
        {currentTask == 'load' && (
          <option value="serverDefault">
            {t('ScreenComposition.selectTarget.serverDefault')}
          </option>
        )}
      </select>
      <select
        onChange={handleChangeNumber}
        className="max-w-xs select select-info select-xs text-accent-content"
        value={currentNumber}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      {currentTask == 'save' && (
        <input
          type="text"
          name="currentTitle"
          placeholder={t('ScreenComposition.placeholder.title') as string}
          value={currentTitle}
          onChange={handleChangeTitle}
          className="w-28 max-w-xs input input-bordered input-sm text-accent-content"
        />
      )}
      {currentTask == 'load' && (
        <div className="ml-1">{loadedTitle ? loadedTitle : 'N/A'}</div>
      )}
      <div className="flex-none w-36">
        <button
          disabled={isLoadingSave || isLoadingLoad || isLoadingDefaultLoad}
          onClick={onClickCancel}
          className="btn btn-xs btn-ghost mr-1"
        >
          {t('SignupForm.Cancel')}
        </button>
        <button
          disabled={
            (currentTask == 'save' && !regexFinal.test(currentTitle)) ||
            (currentTask == 'load' && !regexFinal.test(loadedTitle))
          }
          onClick={onClickHandleTask}
          className={
            isLoadingSave || isLoadingLoad || isLoadingDefaultLoad
              ? 'btn btn-xs btn-accent loading'
              : 'btn btn-xs btn-accent'
          }
        >
          {currentTask == 'save' && t('ScreenComposition.selectTask.save')}
          {currentTask == 'load' && t('ScreenComposition.selectTask.load')}
        </button>
      </div>
      {(isSuccessLocal ||
        isSuccessSave ||
        isSuccessLoad ||
        isSuccessDefaultLoad) && <MaterialSymbolSuccess size={36} />}
      {(isErrorSave || isErrorLoad || isErrorDefaultLoad) && (
        <MaterialSymbolError size={36} />
      )}
    </div>
  );
};
export default React.memo(ScreenComposition);
