import {FC} from 'react';
import Clock from '../../components/main/panels/Clock';
import ClockMini from '../../components/main/panels/ClockMini';
import BoardPage from '../../components/main/panels/BoardPage';
import {RemirrorContentType} from 'remirror';

export type CommonPanelProps = {
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
    boardId: null,
    boardCategory: '0',
    nickname: localStorage.getItem('nickname') || '',
    title: '',
    tag1: null,
    tag2: null,
    tag3: null,
    preview: undefined,
    content: undefined,
    showReplyEditor: false,
    replyId: null,
    parentId: null,
    mountBoardDetail: false
  }
};

export type ClockState = {
  timeZone: string;
};

export type BoardPageState = {
  boardPageCategory: 'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE';
  tag: string;
  searchDisabled: boolean;
  searchMode: boolean;
  sortBy: 'id' | 'likeCount' | 'replyCount' | 'readCount';
  currentPage: number;
  targetPage: number;
  totalPages: number;
  showBoardEditor: boolean;
  boardId: string | null;
  boardCategory: 'STOCK' | 'LIFE' | 'QA' | 'NOTICE' | '0';
  nickname: string;
  title: string;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
  preview: string | undefined;
  content: RemirrorContentType | undefined;
  showReplyEditor: boolean;
  replyId: string | null;
  parentId: string | null;
  mountBoardDetail: boolean;
};

export const deletedString = 'deleted';

export const deletedContent =
  '{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":null,"ignoreBidiAutoUpdate":null},"content":[{"type":"text","text":"deleted"}]}]}';
