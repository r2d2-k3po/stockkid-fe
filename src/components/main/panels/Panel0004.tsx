import React, {FC} from 'react';
import store from '../../../app/store';
import {panelsSelectors} from '../../../app/hooks';
import {PanelCode} from '../../../app/slices/panelsSlice';

type CommonPanelProps = {
  panelId: string;
};

const Panel0004: FC<CommonPanelProps> = ({panelId}) => {
  const panelCode = panelsSelectors.selectById(store.getState(), panelId)
    ?.panelCode as PanelCode;

  return (
    <div>
      <p>{panelCode}</p>
      <p> panelId : {panelId} </p>
    </div>
  );
};

export default Panel0004;
