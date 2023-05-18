import React, {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useRef
} from 'react';
import Panel0000 from './panels/Panel0000';
import Panel0001 from './panels/Panel0001';
import Panel0002 from './panels/Panel0002';
import Panel0003 from './panels/Panel0003';
import Panel0004 from './panels/Panel0004';
import Panel0005 from './panels/Panel0005';
import Panel0006 from './panels/Panel0006';
import Panel0007 from './panels/Panel0007';
import {removePanel} from '../../app/screenPanelMapSlice';
import AlertRemovePanel from './AlertRemovePanel';
import {useAppDispatch} from '../../app/hooks';
import {MaterialSymbol} from 'react-material-symbols';

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

export const panelGrids = {
  panel0000: {i: '', x: 0, y: 0, w: 1, h: 1},
  panel0001: {i: '', x: 0, y: 0, w: 1, h: 2},
  panel0002: {i: '', x: 0, y: 0, w: 1, h: 3},
  panel0003: {i: '', x: 0, y: 0, w: 2, h: 1},
  panel0004: {i: '', x: 0, y: 0, w: 2, h: 2},
  panel0005: {i: '', x: 0, y: 0, w: 2, h: 3},
  panel0006: {i: '', x: 0, y: 0, w: 3, h: 1},
  panel0007: {i: '', x: 0, y: 0, w: 3, h: 2}
};

export type PanelType = {
  panelCode: keyof typeof panels;
};

export type PanelProps = {
  uuidP: string;
  panelType: PanelType;
};

type UuidPanelProps = PanelProps & {
  uuid: string;
};

type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type DivProps = ReactDivProps & PropsWithChildren<UuidPanelProps>;

const Panel = forwardRef<HTMLDivElement, DivProps>(function Panel(
  {
    uuid,
    uuidP,
    panelType,
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

  const removeCurrentPanel = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    visiblePanelButtonsRef.current?.setAttribute('class', 'invisible');
    visibleAlertRemovePanelRef.current?.removeAttribute('class');
  }, []);

  const reallyRemoveCurrentPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const payload = {
        uuid: uuid,
        uuidP: uuidP
      };
      dispatch(removePanel(payload));
      visiblePanelButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemovePanelRef.current?.setAttribute('class', 'hidden');
    },
    [uuid, uuidP, dispatch]
  );

  const cancelRemoveCurrentPanel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      visiblePanelButtonsRef.current?.setAttribute('class', 'visible');
      visibleAlertRemovePanelRef.current?.setAttribute('class', 'hidden');
    },
    []
  );

  const SpecificPanel = panels[panelType.panelCode];

  const className = [
    _className,
    'overflow-visible border-2 border-info rounded-md hover:border-accent'
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
        <div className="flex justify-between m-0.5 gap-1">
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
      <div className="relative">
        <div ref={visibleAlertRemovePanelRef} className="hidden">
          <AlertRemovePanel
            onClickCancel={cancelRemoveCurrentPanel}
            onClickRemove={reallyRemoveCurrentPanel}
          />
        </div>
      </div>
      <SpecificPanel uuidP={uuidP} panelType={panelType} />
      {children}
    </div>
  );
});

export default Panel;
