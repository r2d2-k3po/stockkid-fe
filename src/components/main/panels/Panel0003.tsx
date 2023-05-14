import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0003: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div className="w-52 h-64">
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0003;
