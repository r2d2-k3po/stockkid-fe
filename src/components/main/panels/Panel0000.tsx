import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0000: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-28 h-36">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0000;
