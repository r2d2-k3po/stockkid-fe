import React, {FC} from 'react';
import Panel from './Panel';

export type VirtualScreenProps = {
  uuid: string;
};

const VirtualScreen: FC<VirtualScreenProps> = ({uuid}) => {
  return (
    <div className="flex flex-wrap w-full">
      <p>{uuid}</p>
      <Panel panelCode="panel0000" />
      <Panel panelCode="panel0001" />
      <Panel panelCode="panel0002" />
      <Panel panelCode="panel0003" />
    </div>
  );
};

export default VirtualScreen;
