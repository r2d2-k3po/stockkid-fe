import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import Search from './board/Search';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import BoardPreview from './board/BoardPreview';
import {tokenDecoder} from '../../../utils/tokenDecoder';
import {updatePanelState} from '../../../app/slices/panelsSlice';
import {
  useLazyReadBoardPageQuery,
  useLazySearchBoardPageQuery
} from '../../../app/api';
import {
  BoardPageState,
  CommonPanelProps
} from '../../../app/constants/panelInfo';
import BoardDetail from './board/BoardDetail';

export interface BoardDTO {
  boardId: string;
  memberId: string;
  boardCategory: 'STOCK' | 'LIFE' | 'QA' | 'NOTICE';
  nickname: string;
  title: string;
  preview: string;
  content: string | null;
  tag1: string | null;
  tag2: string | null;
  tag3: string | null;
  readCount: number;
  replyCount: number;
  likeCount: number;
  regDate: string;
  modDate: string;
}

interface BoardPageDTO {
  boardDTOList: BoardDTO[];
  totalPages: number;
}

const BoardPage: FC<CommonPanelProps> = ({panelId}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const tokens = useAppSelector((state) => state.auth);

  const decodedRefreshToken = useMemo(
    () => (tokens.refreshToken ? tokenDecoder(tokens.refreshToken) : null),
    [tokens.refreshToken]
  );

  const memberId = useMemo(
    () => (decodedRefreshToken ? (decodedRefreshToken.sid as string) : null),
    [decodedRefreshToken]
  );

  const memberRole = useMemo(
    () => (decodedRefreshToken ? (decodedRefreshToken.rol as string) : null),
    [decodedRefreshToken]
  );

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const categoryButtonClassName = 'btn btn-xs btn-outline btn-primary';
  const categoryButtonClassNameActive =
    'btn btn-xs btn-outline btn-primary btn-active';

  const [requestBoardPageRead] = useLazyReadBoardPageQuery();

  const [requestBoardPageSearch] = useLazySearchBoardPageQuery();

  const [boardDTOList, setBoardDTOList] = useState<
    BoardDTO[] | null | undefined
  >(null);

  const handleChangeTag = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      const regexFinal = /^.{2,30}$/;
      const tag = e.target.value.trim();
      if (regex.test(tag)) {
        if (regexFinal.test(e.target.value.trim())) {
          const payload = {
            panelId: panelId,
            panelState: {searchDisabled: false, tag: tag, searchMode: false}
          };
          dispatch(updatePanelState(payload));
        } else {
          const payload = {
            panelId: panelId,
            panelState: {searchDisabled: true, tag: tag, searchMode: false}
          };
          dispatch(updatePanelState(payload));
        }
      }
    },
    [dispatch, panelId]
  );

  const handleClickSearch = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          searchMode: true,
          boardId: null,
          currentPage: 1,
          targetPage: 1
        }
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
            | 'id'
            | 'likeCount'
            | 'replyCount'
            | 'readCount',
          boardId: null,
          currentPage: 1,
          targetPage: 1
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
        panelState: {currentPage: 1, boardId: null}
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
        panelState: {currentPage: boardPageState.currentPage - 1, boardId: null}
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
        panelState: {currentPage: boardPageState.currentPage + 1, boardId: null}
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
        panelState: {currentPage: boardPageState.totalPages, boardId: null}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.totalPages]
  );

  const handleChangeTargetPage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(e.target.value);
      if (page < 1) {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: 1}
        };
        dispatch(updatePanelState(payload));
      } else if (page > boardPageState.totalPages) {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: boardPageState.totalPages}
        };
        dispatch(updatePanelState(payload));
      } else {
        const payload = {
          panelId: panelId,
          panelState: {targetPage: page}
        };
        dispatch(updatePanelState(payload));
      }
    },
    [dispatch, panelId, boardPageState.totalPages]
  );

  const moveToTargetPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {currentPage: boardPageState.targetPage, boardId: null}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardPageState.targetPage]
  );

  const enableBoardEditor = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {showBoardEditor: true, boardId: null}
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const loadBoardPageRead = useCallback(async () => {
    const boardPageSetting = {
      page: boardPageState.currentPage.toString(),
      size: '20',
      boardCategory: boardPageState.boardPageCategory,
      sortBy: boardPageState.sortBy
    };
    const dataBoardPage = await requestBoardPageRead(boardPageSetting).unwrap();
    setBoardDTOList((dataBoardPage?.apiObj as BoardPageDTO)?.boardDTOList);
    const totalPages = (dataBoardPage?.apiObj as BoardPageDTO)?.totalPages || 1;
    const payload = {
      panelId: panelId,
      panelState: {
        totalPages: totalPages
      }
    };
    dispatch(updatePanelState(payload));
  }, [
    dispatch,
    panelId,
    boardPageState.currentPage,
    boardPageState.boardPageCategory,
    boardPageState.sortBy,
    requestBoardPageRead
  ]);

  const handleClickCategoryButton = useCallback(
    (category: 'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE') =>
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const reload = category == boardPageState.boardPageCategory;
        const payload = {
          panelId: panelId,
          panelState: {
            boardPageCategory: category,
            boardId: null,
            tag: '',
            searchDisabled: true,
            searchMode: false,
            currentPage: 1,
            targetPage: 1
          }
        };
        dispatch(updatePanelState(payload));
        if (reload) {
          try {
            void loadBoardPageRead();
          } catch (err) {
            console.error(err);
          }
        }
      },
    [dispatch, panelId, boardPageState.boardPageCategory, loadBoardPageRead]
  );

  useEffect(() => {
    if (!boardPageState.searchMode) {
      try {
        void loadBoardPageRead();
      } catch (err) {
        console.error(err);
      }
    }
  }, [boardPageState.searchMode, loadBoardPageRead]);

  useEffect(() => {
    const loadBoardPageSearch = async () => {
      const searchPageSetting = {
        page: boardPageState.currentPage.toString(),
        size: '20',
        boardCategory: boardPageState.boardPageCategory,
        sortBy: boardPageState.sortBy,
        tag: boardPageState.tag
      };
      const dataSearchPage = await requestBoardPageSearch(
        searchPageSetting
      ).unwrap();
      setBoardDTOList((dataSearchPage?.apiObj as BoardPageDTO)?.boardDTOList);
      const totalPages =
        (dataSearchPage?.apiObj as BoardPageDTO)?.totalPages || 1;
      const payload = {
        panelId: panelId,
        panelState: {
          totalPages: totalPages
        }
      };
      dispatch(updatePanelState(payload));
    };

    if (boardPageState.searchMode) {
      try {
        void loadBoardPageSearch();
      } catch (err) {
        console.error(err);
      }
    }
  }, [
    boardPageState.searchMode,
    boardPageState.currentPage,
    boardPageState.boardPageCategory,
    boardPageState.sortBy,
    boardPageState.tag,
    dispatch,
    panelId,
    requestBoardPageSearch
  ]);

  const boardPreviewPage = useMemo(
    () =>
      boardDTOList?.map((boardDTO) => (
        <BoardPreview
          key={boardDTO.boardId}
          panelId={panelId}
          memberId={memberId}
          boardDTO={boardDTO}
        />
      )),
    [boardDTOList, memberId, panelId]
  );

  return (
    <div>
      <div className="flex justify-between border-b border-warning my-2 mx-3">
        <div className="flex justify-start gap-2 mb-2 mt-1">
          <button
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            className={
              boardPageState.boardPageCategory == 'ALL'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('ALL')}
          >
            {t('BoardPage.Category.ALL')}
          </button>
          <button
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            className={
              boardPageState.boardPageCategory == 'STOCK'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('STOCK')}
          >
            {t('BoardPage.Category.STOCK')}
          </button>
          <button
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            className={
              boardPageState.boardPageCategory == 'LIFE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('LIFE')}
          >
            {t('BoardPage.Category.LIFE')}
          </button>
          <button
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
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
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            className={
              boardPageState.boardPageCategory == 'NOTICE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('NOTICE')}
          >
            {t('BoardPage.Category.NOTICE')}
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-2">
          <input
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
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
              searchDisabled={
                boardPageState.searchDisabled ||
                boardPageState.showBoardEditor ||
                boardPageState.showReplyEditor
              }
            />
          </div>
          <select
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            onChange={handleChangeSortBy}
            className="max-w-xs select select-info select-xs text-accent-content mt-1"
            value={boardPageState.sortBy}
          >
            <option value="id">{t('BoardPage.sortBy.id')}</option>
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
            disabled={
              boardPageState.currentPage == 1 ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={moveToFirstPage}
          >
            <i className="ri-skip-left-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={
              boardPageState.currentPage == 1 ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={moveToPrevPage}
          >
            <i className="ri-arrow-left-s-line ri-lg"></i>
          </button>
          <span className="mt-1 text-sm">
            {boardPageState.currentPage}/{boardPageState.totalPages}
          </span>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={
              boardPageState.currentPage == boardPageState.totalPages ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={moveToNextPage}
          >
            <i className="ri-arrow-right-s-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={
              boardPageState.currentPage == boardPageState.totalPages ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={moveToLastPage}
          >
            <i className="ri-skip-right-line ri-lg"></i>
          </button>
          <input
            disabled={
              boardPageState.showBoardEditor || boardPageState.showReplyEditor
            }
            type="number"
            name="targetPage"
            value={boardPageState.targetPage}
            min={1}
            max={boardPageState.totalPages}
            onChange={handleChangeTargetPage}
            className="w-20 max-w-xs input input-bordered input-secondary input-xs text-accent-content mt-1"
          />
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={
              boardPageState.currentPage == boardPageState.targetPage ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={moveToTargetPage}
          >
            <i className="ri-corner-up-left-double-line ri-lg"></i>
          </button>
          <button
            className="btn btn-sm btn-accent btn-outline btn-circle ml-3"
            disabled={
              memberId == null ||
              boardPageState.showBoardEditor ||
              boardPageState.showReplyEditor
            }
            onClick={enableBoardEditor}
          >
            <i className="ri-pencil-line ri-lg"></i>
          </button>
        </div>
      </div>
      <BoardDetail
        memberId={memberId}
        panelId={panelId}
        memberRole={memberRole}
        setBoardDTOList={setBoardDTOList}
      />
      {boardPageState.boardId == null && !boardPageState.showBoardEditor && (
        <div className="my-2 ml-3 mr-1 absolute left-0 right-0 top-20 bottom-0 overflow-y-auto">
          {!!boardPreviewPage && boardPreviewPage}
        </div>
      )}
    </div>
  );
};

export default React.memo(BoardPage);
