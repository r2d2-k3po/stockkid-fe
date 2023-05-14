import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0002: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-60 h-40">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0002;
