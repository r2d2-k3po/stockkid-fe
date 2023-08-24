import React, {FC} from 'react';
import {EntityId} from '@reduxjs/toolkit';
import {panelsSelectors} from '../../../app/slices/panelsSlice';
import store from '../../../app/store';
import {panelTypes} from '../Panel';

type CommonPanelProps = {
  panelId: EntityId;
};

const Panel0001: FC<CommonPanelProps> = ({panelId}) => {
  const panelCode = panelsSelectors.selectById(store.getState(), panelId)
    ?.panelCode as keyof typeof panelTypes;

  return (
    <div>
      <p>{panelCode}</p>
      <p> panelId : {panelId} </p>
    </div>
  );
};
export default Panel0001;
