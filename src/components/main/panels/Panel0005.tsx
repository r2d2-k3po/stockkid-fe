import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0005: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-72 h-72">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0005;
