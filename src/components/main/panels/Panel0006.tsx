import React, {FC} from 'react';
import {PanelProps} from '../Panel';

const Panel0006: FC<PanelProps> = ({uuidP, panelType}) => {
  return (
    <div>
      <p>{panelType.panelCode}</p>
      <p> uuidP : {uuidP} </p>
    </div>
  );
};

export default Panel0006;
