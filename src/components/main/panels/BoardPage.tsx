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
import {useAppSelector} from '../../../app/hooks';
import Board from './board/Board';
import {tokenDecoder} from '../../../utils/tokenDecoder';

type CommonPanelProps = {
  panelId: string;
};

const BoardPage: FC<CommonPanelProps> = ({panelId}) => {
  const {t} = useTranslation();

  const tokens = useAppSelector((state) => state.auth);
  const loggedIn = !(tokens.refreshToken == null);

  const decodedAccessToken = useMemo(
    () => (tokens.accessToken ? tokenDecoder(tokens.accessToken) : null),
    [tokens.accessToken]
  );

  const memberId = useMemo(
    () => (decodedAccessToken ? (decodedAccessToken.sid as string) : null),
    [decodedAccessToken]
  );

  const [boardCategory, setBoardCategory] = useState<
    'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
  >('ALL');

  // search tag
  const [tag, setTag] = useState<string>('');

  // Search button disabled
  const [searchDisabled, setSearchDisabled] = useState<boolean>(true);

  // search is being processed for the current tag, not the usual BoardPage read
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<
    'boardId' | 'likeCount' | 'replyCount' | 'readCount'
  >('boardId');

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [targetPage, setTargetPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(10);

  const [showNewBoard, setShowNewBoard] = useState<boolean>(
    (localStorage.getItem('showNewBoard') || 'false') === 'true'
  );

  const categoryButtonClassName = 'btn btn-sm btn-outline btn-primary';
  const categoryButtonClassNameActive =
    'btn btn-sm btn-outline btn-primary btn-active';

  const handleClickCategoryButton = useCallback(
    (category: 'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE') =>
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setBoardCategory(category);
        setTag('');
        setSearchDisabled(true);
        setSearchMode(false);
      },
    []
  );

  const handleChangeTag = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^.{0,30}$/;
    const regexFinal = /^.{2,30}$/;
    if (regex.test(e.target.value)) {
      setTag(e.target.value.trim());
      if (regexFinal.test(e.target.value.trim())) {
        setSearchDisabled(false);
      } else {
        setSearchDisabled(true);
      }
    }
    setSearchMode(false);
  }, []);

  const handleClickSearch = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSearchMode(true);
  }, []);

  const handleChangeSortBy = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setSortBy(
        e.target.value as 'boardId' | 'likeCount' | 'replyCount' | 'readCount'
      );
    },
    []
  );

  const moveToFirstPage = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentPage(1);
  }, []);

  const moveToPrevPage = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentPage((currentPage) => currentPage - 1);
  }, []);

  const moveToNextPage = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentPage((currentPage) => currentPage + 1);
  }, []);

  const moveToLastPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setCurrentPage(totalPage);
    },
    [totalPage]
  );

  const handleChangePage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const page = parseInt(e.target.value);
      if (page < 1) setTargetPage(1);
      else if (page > totalPage) setTargetPage(totalPage);
      else setTargetPage(parseInt(e.target.value));
    },
    [totalPage]
  );

  const moveToTargetPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setCurrentPage(targetPage);
    },
    [targetPage]
  );

  const enableEditor = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    localStorage.setItem('showNewBoard', 'true');
    setShowNewBoard(true);
  }, []);

  return (
    <div>
      <div className="flex justify-between border-b border-warning my-2 mx-3">
        <div className="flex justify-start gap-2 mb-2">
          <button
            className={
              boardCategory == 'ALL'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('ALL')}
          >
            {t('BoardPage.Category.All')}
          </button>
          <button
            className={
              boardCategory == 'STOCK'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('STOCK')}
          >
            {t('BoardPage.Category.Stock')}
          </button>
          <button
            className={
              boardCategory == 'LIFE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('LIFE')}
          >
            {t('BoardPage.Category.Life')}
          </button>
          <button
            className={
              boardCategory == 'QA'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('QA')}
          >
            {t('BoardPage.Category.QA')}
          </button>
          <button
            className={
              boardCategory == 'NOTICE'
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
            value={tag}
            onChange={handleChangeTag}
            className="w-36 max-w-xs input input-bordered input-info input-xs mt-1 text-accent-content"
          />
          <div className="mt-1" onClick={handleClickSearch}>
            <Search searchMode={searchMode} searchDisabled={searchDisabled} />
          </div>
          <select
            onChange={handleChangeSortBy}
            className="max-w-xs select select-info select-xs text-accent-content mt-1"
            value={sortBy}
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
            disabled={currentPage == 1}
            onClick={moveToFirstPage}
          >
            <i className="ri-skip-left-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={currentPage == 1}
            onClick={moveToPrevPage}
          >
            <i className="ri-arrow-left-s-line ri-lg"></i>
          </button>
          <span className="mt-1 text-sm">
            {currentPage}/{totalPage}
          </span>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={currentPage == totalPage}
            onClick={moveToNextPage}
          >
            <i className="ri-arrow-right-s-line ri-lg"></i>
          </button>
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={currentPage == totalPage}
            onClick={moveToLastPage}
          >
            <i className="ri-skip-right-line ri-lg"></i>
          </button>
          <input
            type="number"
            name="targetPage"
            value={targetPage}
            min={1}
            max={totalPage}
            onChange={handleChangePage}
            className="w-20 max-w-xs input input-bordered input-secondary input-xs text-accent-content mt-1"
          />
          <button
            className="btn btn-xs btn-ghost btn-circle mt-1"
            disabled={currentPage == targetPage}
            onClick={moveToTargetPage}
          >
            <i className="ri-corner-up-left-double-line ri-lg"></i>
          </button>
          <button
            className="btn btn-sm btn-accent btn-circle ml-3"
            disabled={!loggedIn || showNewBoard}
            onClick={enableEditor}
          >
            <i className="ri-pencil-line ri-lg"></i>
          </button>
        </div>
      </div>
      <div className={showNewBoard ? '' : 'hidden'}>
        <Board setShowNewBoard={setShowNewBoard} mode="register" />
      </div>
      <div className="my-2 mx-3">BoardList</div>
    </div>
  );
};

export default React.memo(BoardPage);
