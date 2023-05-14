import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0007: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-96 h-96">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0007;
