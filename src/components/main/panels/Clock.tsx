import React, {ChangeEvent, FC, useCallback, useState} from 'react';
import store from '../../../app/store';
import {panelsSelectors} from '../../../app/hooks';
import {PanelCode} from '../../../app/constants/panelInfo';

type CommonPanelProps = {
  panelId: string;
};

const Clock: FC<CommonPanelProps> = ({panelId}) => {
  const [offsetInSeconds, setOffsetInSeconds] = useState<number>(0);

    const handleChangeOffsetInSeconds = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            e.stopPropagation();
            setOffsetInSeconds(e.target.value);
        },
        []
    );

  return (
    <div>
      <select
        onChange={handleChangeOffsetInSeconds}
        className="max-w-xs select select-info select-xs"
        value={offsetInSeconds}
      >
        <option value=0>{t('Main.CompactTypeVertical')}</option>
        <option value="horizontal">{t('Main.CompactTypeHorizontal')}</option>
        <option value="null">{t('Main.CompactTypeNone')}</option>
      </select>
    </div>
  );
};

export default React.memo(Clock);
