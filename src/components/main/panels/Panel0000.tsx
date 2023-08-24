import React, {FC} from 'react';
import {panelTypes} from '../Panel';
import {panelsSelectors} from '../../../app/slices/panelsSlice';
import store from '../../../app/store';
import {EntityId} from '@reduxjs/toolkit';

type CommonPanelProps = {
  panelId: EntityId;
};

const Panel0000: FC<CommonPanelProps> = ({panelId}) => {
  const panelCode = panelsSelectors.selectById(store.getState(), panelId)
    ?.panelCode as keyof typeof panelTypes;

  return (
    <div>
      <p>{panelCode}</p>
      <p> panelId : {panelId} </p>
    </div>
  );
};

export default Panel0000;
