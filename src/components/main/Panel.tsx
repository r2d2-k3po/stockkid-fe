import React, {FC} from 'react';
import Panel0000 from './panels/Panel0000';
import Panel0001 from './panels/Panel0001';
import Panel0002 from './panels/Panel0002';
import Panel0003 from './panels/Panel0003';
import Panel0004 from './panels/Panel0004';
import Panel0005 from './panels/Panel0005';
import Panel0006 from './panels/Panel0006';
import Panel0007 from './panels/Panel0007';

export const panels = {
  panel0000: Panel0000,
  panel0001: Panel0001,
  panel0002: Panel0002,
  panel0003: Panel0003,
  panel0004: Panel0004,
  panel0005: Panel0005,
  panel0006: Panel0006,
  panel0007: Panel0007
};

export type PanelProps = {
  panelCode: keyof typeof panels;
};

const Panel: FC<PanelProps> = ({panelCode}) => {
  const SpecificPanel = panels[panelCode];
  return <SpecificPanel />;
};

export default Panel;
