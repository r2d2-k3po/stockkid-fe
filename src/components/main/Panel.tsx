import React, {FC, MouseEvent, useCallback, useRef} from 'react';
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

const Panel: FC<UuidPanelProps> = ({uuid, uuidP, panelType}) => {
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

  return (
    <div className="overflow-visible resize border-2 border-info rounded-md m-0.5 hover:border-accent">
      <div ref={visiblePanelButtonsRef} className="visible">
        <div className="flex justify-start m-0.5 gap-1">
          <button
            className="btn btn-xs btn-outline btn-warning"
            onClick={removeCurrentPanel}
          >
            -
          </button>
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
    </div>
  );
};

export default Panel;
