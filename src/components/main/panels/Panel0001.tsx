import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0001: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-40 h-96">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0001;
