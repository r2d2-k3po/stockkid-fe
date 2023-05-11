import React, {FC} from 'react';
import Panel0000 from './panels/Panel0000';
import Panel0001 from './panels/Panel0001';
import Panel0002 from './panels/Panel0002';
import Panel0003 from './panels/Panel0003';

export const panels = {
  panel0000: Panel0000,
  panel0001: Panel0001,
  panel0002: Panel0002,
  panel0003: Panel0003
};

export type PanelProps = {
  panelCode: keyof typeof panels;
};

const Panel: FC<PanelProps> = ({panelCode}) => {
  const SpecificPanel = panels[panelCode];
  return <SpecificPanel />;
};

export default Panel;
