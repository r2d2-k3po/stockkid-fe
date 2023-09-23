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
  useLazyLoadScreenSettingDefaultQuery,
  useLazyLoadScreenSettingQuery,
  useLoadScreenTitlesDefaultQuery,
  useLoadScreenTitlesQuery,
  useSaveScreenCompositionMutation
} from '../../../../app/api';
import {loadScreens} from '../../../../app/slices/screensSlice';
import {EntityState} from '@reduxjs/toolkit';
import {Panel} from '../../../../app/slices/panelsSlice';
import {Screen} from '../../../../app/slices/screensSlice';

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
  const dispatch = useAppDispatch();

  const screens = useAppSelector((state) => state.screens);
  const panels = useAppSelector((state) => state.panels);

  const [requestScreenCompositionSave, {isLoading: isLoadingSave}] =
    useSaveScreenCompositionMutation();
  const [requestScreenSettingLoad, {isFetching: isLoadingLoad}] =
    useLazyLoadScreenSettingQuery();
  const [requestScreenSettingDefaultLoad, {isFetching: isLoadingLoadDefault}] =
    useLazyLoadScreenSettingDefaultQuery();
  const {data: dataScreenTitles} = useLoadScreenTitlesQuery();
  const {data: dataScreenTitlesDefault} = useLoadScreenTitlesDefaultQuery();

  const [currentTask, setCurrentTask] = useState<'save' | 'load'>('save');

  const [currentTarget, setCurrentTarget] = useState<
    'localStorage' | 'server' | 'serverDefault'
  >('localStorage');

  const [currentNumber, setCurrentNumber] = useState<'1' | '2' | '3'>('1');

  const [currentTitle, setCurrentTitle] = useState<string>('');

  const handleChangeTask = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setCurrentTask(e.target.value as 'save' | 'load');
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
      const key = 'screenSetting' + currentNumber;
      if (currentTask == 'save') {
        const screenSetting = {
          screens: screens,
          panels: panels
        };
        if (currentTarget == 'localStorage') {
          localStorage.setItem('screenTitle' + currentNumber, currentTitle);
          localStorage.setItem(key, JSON.stringify(screenSetting));
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
      dispatch
    ]
  );

  useEffect(() => {
    setIsUninitialized(true);
  }, [setIsUninitialized]);

  return (
    <div className="ml-1 flex items-center gap-1">
      <select
        onChange={handleChangeTask}
        className="max-w-xs select select-info select-xs"
        value={currentTask}
      >
        <option value="save">{t('ScreenComposition.selectTask.save')}</option>
        <option value="load">{t('ScreenComposition.selectTask.load')}</option>
      </select>
      <select
        onChange={handleChangeTarget}
        className="max-w-xs select select-info select-xs"
        value={currentTarget}
      >
        <option value="localStorage">
          {t('ScreenComposition.selectTarget.localStorage')}
        </option>
        <option value="server">
          {t('ScreenComposition.selectTarget.server')}
        </option>
        {currentTask == 'load' && (
          <option value="serverDefault">
            {t('ScreenComposition.selectTarget.serverDefault')}
          </option>
        )}
      </select>
      <select
        onChange={handleChangeNumber}
        className="max-w-xs select select-info select-xs"
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
          className="w-28 max-w-xs input input-bordered input-sm"
        />
      )}
      {currentTask == 'load' &&
        currentTarget == 'localStorage' &&
        localStorage.getItem('screenTitle' + currentNumber) && (
          <div className="ml-1">
            {localStorage.getItem('screenTitle' + currentNumber)}
          </div>
        )}
      {currentTask == 'load' &&
        currentTarget == 'server' &&
        (dataScreenTitles?.apiObj as ScreenTitles)[
          'screenTitle' + currentNumber
        ] && (
          <div className="ml-1">
            {
              (dataScreenTitles?.apiObj as ScreenTitles)[
                'screenTitle' + currentNumber
              ]
            }
          </div>
        )}
      {currentTask == 'load' &&
        currentTarget == 'serverDefault' &&
        (dataScreenTitlesDefault?.apiObj as ScreenTitles)[
          'screenTitle' + currentNumber
        ] && (
          <div className="ml-1">
            {
              (dataScreenTitlesDefault?.apiObj as ScreenTitles)[
                'screenTitle' + currentNumber
              ]
            }
          </div>
        )}
      <div className="flex-none w-52">
        <button
          disabled={isLoadingSave || isLoadingLoad || isLoadingLoadDefault}
          onClick={onClickCancel}
          className="btn btn-xs btn-ghost mr-1"
        >
          {t('SignupForm.Cancel')}
        </button>
        <button
          disabled={
            (currentTask == 'save' && !regexFinal.test(currentTitle)) ||
            (currentTask == 'load' &&
              currentTarget == 'localStorage' &&
              localStorage.getItem('screenTitle' + currentNumber) == null)
          }
          onClick={onClickHandleTask}
          className={
            isLoadingSave || isLoadingLoad || isLoadingLoadDefault
              ? 'btn btn-xs btn-accent loading'
              : 'btn btn-xs btn-accent'
          }
        >
          {currentTask == 'save' && t('ScreenComposition.selectTask.save')}
          {currentTask == 'load' && t('ScreenComposition.selectTask.load')}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ScreenComposition);
