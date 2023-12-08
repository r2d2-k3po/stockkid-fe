import {FC} from 'react';
import Clock from '../../components/main/panels/Clock';
import ClockMini from '../../components/main/panels/ClockMini';
import BoardPage from '../../components/main/panels/BoardPage';

type CommonPanelProps = {
  panelId: string;
};

type PanelTypes = Record<PanelCode, FC<CommonPanelProps>>;

type PanelGrids = Record<PanelCode, object>;

type PanelState = Record<PanelCode, object>;

// update

export type PanelCode = 'clock' | 'clockMini' | 'boardPage';

export const panelTypes: PanelTypes = {
  clock: Clock,
  clockMini: ClockMini,
  boardPage: BoardPage
};

export const panelGrids: PanelGrids = {
  clock: {i: '', x: 0, y: 0, w: 4, h: 3},
  clockMini: {i: '', x: 0, y: 0, w: 3, h: 2},
  boardPage: {i: '', x: 0, y: 0, w: 20, h: 20}
};

export const panelState: PanelState = {
  clock: {timeZone: 'local'},
  clockMini: {timeZone: 'local'},
  boardPage: {
    boardPageCategory: 'ALL',
    tag: '',
    searchDisabled: true,
    searchMode: false,
    sortBy: 'id',
    currentPage: 1,
    targetPage: 1,
    totalPages: 1,
    showBoardEditor: false,
    boardCategory: '0',
    nickname: localStorage.getItem('nickname') || '',
    title: '',
    tag1: undefined,
    tag2: undefined,
    tag3: undefined,
    preview: undefined,
    content: undefined
  }
};
