import React, {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  useCallback,
  useRef
} from 'react';
import store from '../../app/store';
import AlertRemovePanel from './AlertRemovePanel';
import {panelsSelectors, useAppDispatch} from '../../app/hooks';
import {MaterialSymbol} from 'react-material-symbols';
import {invisibleRefVisibleRef} from '../../utils/invisibleRefVisibleRef';
import {visibleRefHiddenRef} from '../../utils/visibleRefHiddenRef';
import {removeScreenPanel} from '../../app/slices/screensSlice';
import {PanelCode, panelTypes} from '../../app/constants/panelInfo';
import {useTranslation} from 'react-i18next';

type PanelBaseProps = {
  screenId: string;
  panelId: string;
};

type ReactDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

type DivProps = ReactDivProps & PanelBaseProps;

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
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const visiblePanelButtonsRef = useRef<HTMLDivElement>(null);
  const visibleAlertRemovePanelRef = useRef<HTMLDivElement>(null);

  const panelCode = panelsSelectors.selectById(store.getState(), panelId)
    ?.panelCode as PanelCode;

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
      <div className="flex justify-between gap-1 m-0.5">
        <span>{t(`Panels.${panelCode}`)}</span>
        <div ref={visiblePanelButtonsRef} className="visible">
          <div className="flex justify-end gap-1 m-0.5">
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
