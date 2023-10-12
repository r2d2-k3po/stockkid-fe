type PanelGrids = Record<PanelCode, object>;

// update panelTypes from PanelBase.tsx

export type PanelCode =
  | 'clock'
  | 'clockMini'
  | 'panel0002'
  | 'panel0003'
  | 'panel0004'
  | 'panel0005'
  | 'panel0006'
  | 'panel0007';

export const panelGrids: PanelGrids = {
  clock: {i: '', x: 0, y: 0, w: 4, h: 3},
  clockMini: {i: '', x: 0, y: 0, w: 3, h: 2},
  panel0002: {i: '', x: 0, y: 0, w: 1, h: 3},
  panel0003: {i: '', x: 0, y: 0, w: 2, h: 1},
  panel0004: {i: '', x: 0, y: 0, w: 2, h: 2},
  panel0005: {i: '', x: 0, y: 0, w: 2, h: 3},
  panel0006: {i: '', x: 0, y: 0, w: 3, h: 1},
  panel0007: {i: '', x: 0, y: 0, w: 3, h: 2}
};
