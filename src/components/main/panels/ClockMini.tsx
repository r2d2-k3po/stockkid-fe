import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DateTime} from 'luxon';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {updatePanelState} from '../../../app/slices/panelsSlice';

type ClockState = {
  timeZone: string;
};

type CommonPanelProps = {
  panelId: string;
};

const ClockMini: FC<CommonPanelProps> = ({panelId}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();

  const locale =
    i18n.language == 'ko' ? 'ko' : i18n.language == 'en' ? 'en-US' : '';

  const clockState = useAppSelector((state) => state.panels).entities[panelId]
    ?.panelState as ClockState;

  const [now, setNow] = useState<DateTime>(DateTime.now());

  const handleChangeTimeZone = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {timeZone: e.target.value}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  useEffect(() => {
    const id = setInterval(() => {
      switch (clockState.timeZone) {
        case 'local':
          setNow(DateTime.now());
          break;
        case 'seoul':
          setNow(DateTime.now().setZone('Asia/Seoul'));
          break;
        case 'newyork':
          setNow(DateTime.now().setZone('America/New_York'));
          break;
        case 'hongkong':
          setNow(DateTime.now().setZone('Asia/Hong_Kong'));
          break;
        case 'eu':
          setNow(DateTime.now().setZone('Europe/Amsterdam'));
          break;
        case 'london':
          setNow(DateTime.now().setZone('Europe/London'));
          break;
        case 'mumbai':
          setNow(DateTime.now().setZone('Asia/Kolkata'));
          break;
        case 'sydney':
          setNow(DateTime.now().setZone('Australia/Sydney'));
          break;
        default:
          setNow(DateTime.now());
      }
    }, 1000);
    return () => clearInterval(id);
  }, [clockState.timeZone]);

  return (
    <div className="m-1 mt-0.5 text-sm">
      <select
        onChange={handleChangeTimeZone}
        className="max-w-xs select select-info select-xs"
        value={clockState.timeZone}
      >
        <option value="local">{t('ClockMini.Local')}</option>
        <option value="seoul">{t('ClockMini.Seoul')}</option>
        <option value="newyork">{t('ClockMini.NewYork')}</option>
        <option value="hongkong">{t('ClockMini.HongKong')}</option>
        <option value="eu">{t('ClockMini.EU')}</option>
        <option value="london">{t('ClockMini.London')}</option>
        <option value="mumbai">{t('ClockMini.Mumbai')}</option>
        <option value="sydney">{t('ClockMini.Sydney')}</option>
      </select>
      <div className="mt-0.5">
        {now.setLocale(locale).toLocaleString(DateTime.TIME_WITH_SECONDS)}
      </div>
    </div>
  );
};

export default React.memo(ClockMini);
