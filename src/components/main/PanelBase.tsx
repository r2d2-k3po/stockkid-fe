import React, {
  DetailedHTMLProps,
  FC,
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useRef
} from 'react';
import store from '../../app/store';
import AlertRemovePanel from './AlertRemovePanel';
import {panelsSelectors, useAppDispatch} from '../../app/hooks';
import {MaterialSymbol} from 'react-material-symbols';
import {invisibleRefVisibleRef} from '../../utils/invisibleRefVisibleRef';
import {visibleRefHiddenRef} from '../../utils/visibleRefHiddenRef';
import {EntityId} from '@reduxjs/toolkit';
import {removeScreenPanel} from '../../app/slices/screensSlice';
import Panel0000 from './panels/Panel0000';
import Panel0001, {CommonPanelProps} from './panels/Panel0001';
import Panel0002 from './panels/Panel0002';
import Panel0003 from './panels/Panel0003';
import Panel0004 from './panels/Panel0004';
import Panel0005 from './panels/Panel0005';
import Panel0006 from './panels/Panel0006';
import Panel0007 from './panels/Panel0007';
import {PanelCode} from '../../app/slices/panelsSlice';

type PanelTypes = Record<PanelCode, FC<CommonPanelProps>>;
export const panelTypes: PanelTypes = {
  panel0000: Panel0000,
  panel0001: Panel0001,
  panel0002: Panel0002,
  panel0003: Panel0003,
  panel0004: Panel0004,
  panel0005: Panel0005,
  panel0006: Panel0006,
  panel0007: Panel0007
};

type PanelBaseProps = {
  screenId: EntityId;
  panelId: EntityId;
};

type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type DivProps = ReactDivProps & PropsWithChildren<PanelBaseProps>;

const PanelBase = forwardRef<HTMLDivElement, DivProps>(function PanelBase(
  {
    screenId,
    panelId,
    style,
    className: _className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    children
  },
  ref
) {
  const dispatch = useAppDispatch();
  const visiblePanelButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemovePanelRef = useRef<HTMLDivElement>(null);

  const panelCode = panelsSelectors.selectById(store.getState(), panelId)
    ?.panelCode as keyof typeof panelTypes;

  const removeCurrentPanel = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    invisibleRefVisibleRef(visiblePanelButtonsRef, visibleAlertRemovePanelRef);
  }, []);

  const reallyRemoveCurrentPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      dispatch(
        removeScreenPanel({
          screenId: screenId,
          panelId: panelId
        })
      );
      visibleRefHiddenRef(visiblePanelButtonsRef, visibleAlertRemovePanelRef);
    },
    [screenId, panelId, dispatch]
  );

  const cancelRemoveCurrentPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      visibleRefHiddenRef(visiblePanelButtonsRef, visibleAlertRemovePanelRef);
    },
    []
  );

  const SpecificPanel = panelTypes[panelCode];

  const className = [
    _className,
    'border-2 border-info rounded-md hover:border-accent relative'
  ].join(' ');

  return (
    <div
      style={{...style}}
      className={className}
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      <div ref={visiblePanelButtonsRef} className="visible">
        <div className="flex justify-between gap-1 m-0.5">
          <button
            className="btn btn-xs btn-outline btn-warning"
            onClick={removeCurrentPanel}
          >
            -
          </button>
          <MaterialSymbol
            icon="drag_pan"
            className="drag_pan btn btn-xs btn-outline btn-warning"
            size={22}
            grade={-25}
            weight={200}
          />
        </div>
      </div>
      <div ref={visibleAlertRemovePanelRef} className="hidden">
        <AlertRemovePanel
          onClickCancel={cancelRemoveCurrentPanel}
          onClickRemove={reallyRemoveCurrentPanel}
        />
      </div>
      <SpecificPanel panelId={panelId} />
      {children}
    </div>
  );
});

export default React.memo(PanelBase);
