import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import {useTranslation} from 'react-i18next';
import Search from './board/Search';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import Board from './board/Board';
import {tokenDecoder} from '../../../utils/tokenDecoder';
import {updatePanelState} from '../../../app/slices/panelsSlice';
import {RemirrorContentType} from 'remirror';

export type BoardPageState = {
  boardPageCategory: 'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE';
  tag: string;
  searchDisabled: boolean;
  searchMode: boolean;
  sortBy: 'boardId' | 'likeCount' | 'replyCount' | 'readCount';
  currentPage: number;
  targetPage: number;
  totalPage: number;
  showNewBoard: boolean;
  boardCategory: 'STOCK' | 'LIFE' | 'QA' | 'NOTICE' | '0';
  nickname: string;
  title: string;
  tag1: string | undefined;
  tag2: string | undefined;
  tag3: string | undefined;
  preview: string | undefined;
  initialContent: RemirrorContentType | undefined;
};

type CommonPanelProps = {
  panelId: string;
};

const BoardPage: FC<CommonPanelProps> = ({panelId}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth);
  const loggedIn = !(tokens.refreshToken == null);

  const decodedRefreshToken = useMemo(
    () => (tokens.refreshToken ? tokenDecoder(tokens.refreshToken) : null),
    [tokens.refreshToken]
  );

  const memberId = useMemo(
    () => (decodedRefreshToken ? (decodedRefreshToken.sid as string) : null),
    [decodedRefreshToken]
  );

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const categoryButtonClassName = 'btn btn-sm btn-outline btn-primary';
  const categoryButtonClassNameActive =
    'btn btn-sm btn-outline btn-primary btn-active';

  const handleClickCategoryButton = useCallback(
    (category: 'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE') =>
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const payload = {
          panelId: panelId,
          panelState: {
            boardPageCategory: category,
            tag: '',
            searchDisabled: true,
            searchMode: false
          }
        };
        dispatch(updatePanelState(payload));
      },
    [dispatch, panelId]
  );

  const handleChangeTag = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      const regexFinal = /^.{2,30}$/;
      if (regex.test(e.target.value)) {
        const payload = {
          panelId: panelId,
          panelState: {tag: e.target.value.trim()}
        };
        dispatch(updatePanelState(payload));
        if (regexFinal.test(e.target.value.trim())) {
          const payload = {
            panelId: panelId,
            panelState: {searchDisabled: false}
          };
          dispatch(updatePanelState(payload));
        } else {
          const payload = {
            panelId: panelId,
            panelState: {searchDisabled: true}
          };
          dispatch(updatePanelState(payload));
        }
      }
      const payload = {
        panelId: panelId,
        panelState: {searchMode: false}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const handleClickSearch = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {searchMode: true}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const handleChangeSortBy = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          sortBy: e.target.value as
            | 'boardId'
            | 'likeCount'
            | 'replyCount'
            | 'readCount'
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const moveToFirstPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: 1}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const moveToPrevPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: boardPageState.currentPage - 1}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.currentPage]
  );

  const moveToNextPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: boardPageState.currentPage + 1}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.currentPage]
  );

  const moveToLastPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: boardPageState.totalPage}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.totalPage]
  );

  const handleChangePage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(e.target.value);
      if (page < 1) {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: 1}
        };
        dispatch(updatePanelState(payload));
      } else if (page > boardPageState.totalPage) {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: boardPageState.totalPage}
        };
        dispatch(updatePanelState(payload));
      } else {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: parseInt(e.target.value)}
        };
        dispatch(updatePanelState(payload));
      }
    },
    [dispatch, panelId, boardPageState.totalPage]
  );

  const moveToTargetPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: boardPageState.targetPage}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.targetPage]
  );

  const enableEditor = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {showNewBoard: true}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  return (
    <div>
      <div className="flex justify-between border-b border-warning my-2 mx-3">
        <div className="flex justify-start gap-2 mb-2">
          <button
            className={
              boardPageState.boardPageCategory == 'ALL'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('ALL')}
          >
            {t('BoardPage.Category.All')}
          </button>
          <button
            className={
              boardPageState.boardPageCategory == 'STOCK'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('STOCK')}
          >
            {t('BoardPage.Category.Stock')}
          </button>
          <button
            className={
              boardPageState.boardPageCategory == 'LIFE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('LIFE')}
          >
            {t('BoardPage.Category.Life')}
          </button>
          <button
            className={
              boardPageState.boardPageCategory == 'QA'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('QA')}
          >
            {t('BoardPage.Category.QA')}
          </button>
          <button
            className={
              boardPageState.boardPageCategory == 'NOTICE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('NOTICE')}
          >
            {t('BoardPage.Category.Notice')}
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-2">
          <input
            type="text"
            name="tag"
            placeholder={t('BoardPage.placeholder.tag') as string}
            value={boardPageState.tag}
            onChange={handleChangeTag}
            className="w-36 max-w-xs input input-bordered input-info input-xs mt-1 text-accent-content"
          />
          <div className="mt-1" onClick={handleClickSearch}>
            <Search
              searchMode={boardPageState.searchMode}
              searchDisabled={boardPageState.searchDisabled}
            />
          </div>
          <select
            onChange={handleChangeSortBy}
            className="max-w-xs select select-info select-xs text-accent-content mt-1"
            value={boardPageState.sortBy}
          >
            <option value="boardId">{t('BoardPage.sortBy.boardId')}</option>
            <option value="likeCount">{t('BoardPage.sortBy.likeCount')}</option>
            <option value="replyCount">
              {t('BoardPage.sortBy.replyCount')}
            </option>
            <option value="readCount">{t('BoardPage.sortBy.readCount')}</option>
          </select>
        </div>
        <div className="flex justify-end gap-1 mb-2 text-secondary">
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={boardPageState.currentPage == 1}
            onClick={moveToFirstPage}
          >
            <i className="ri-skip-left-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={boardPageState.currentPage == 1}
            onClick={moveToPrevPage}
          >
            <i className="ri-arrow-left-s-line ri-lg"></i>
          </button>
          <span className="mt-1 text-sm">
            {boardPageState.currentPage}/{boardPageState.totalPage}
          </span>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={boardPageState.currentPage == boardPageState.totalPage}
            onClick={moveToNextPage}
          >
            <i className="ri-arrow-right-s-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={boardPageState.currentPage == boardPageState.totalPage}
            onClick={moveToLastPage}
          >
            <i className="ri-skip-right-line ri-lg"></i>
          </button>
          <input
            type="number"
            name="targetPage"
            value={boardPageState.targetPage}
            min={1}
            max={boardPageState.totalPage}
            onChange={handleChangePage}
            className="w-20 max-w-xs input input-bordered input-secondary input-xs text-accent-content mt-1"
          />
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={boardPageState.currentPage == boardPageState.targetPage}
            onClick={moveToTargetPage}
          >
            <i className="ri-corner-up-left-double-line ri-lg"></i>
          </button>
          <button
            className="btn btn-sm btn-accent btn-circle ml-3"
            disabled={!loggedIn || boardPageState.showNewBoard}
            onClick={enableEditor}
          >
            <i className="ri-pencil-line ri-lg"></i>
          </button>
        </div>
      </div>
      <div className={boardPageState.showNewBoard ? '' : 'hidden'}>
        <Board memberId={memberId} panelId={panelId} mode="register" />
      </div>
      <div className="my-2 mx-3">BoardList</div>
    </div>
  );
};

export default React.memo(BoardPage);
