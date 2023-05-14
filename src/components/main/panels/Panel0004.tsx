import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0004: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-52 h-60">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0004;
