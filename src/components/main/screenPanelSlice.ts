import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import {panels} from './Panel';
import {useAppSelector} from '../../app/hooks';

export type PanelType = {
  panelUuid: string;
  panelCode: keyof typeof panels;
};

const uuidList = [uuidv4(), uuidv4(), uuidv4()];

export type ScreenPanelState = Record<string, PanelType[]>;

interface screenPanelRecordState {
  uuidList: string[];
}

interface screenPanelState {
  uuidList: string[];
}
