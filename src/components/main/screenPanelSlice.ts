import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import {panels} from './Panel';

export type PanelType = {
  panelUuid: string;
  panelCode: keyof typeof panels;
};

export type ScreenPanelState = Record<string, PanelType[]>;

interface screenPanelState {
  uuidList: string[];
}
