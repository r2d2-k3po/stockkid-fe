import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import Search from './board/Search';

type CommonPanelProps = {
  panelId: string;
};

const Board: FC<CommonPanelProps> = ({panelId}) => {
  const {t} = useTranslation();

  const [boardCategory, setBoardCategory] = useState<
    'ALL' | 'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
  >('ALL');

  const [tag, setTag] = useState<string>('');

  const [searchDisabled, setSearchDisabled] = useState<boolean>(true);

  const [searchMode, setSearchMode] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [targetPage, setTargetPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(10);

  const categoryButtonClassName = 'btn btn-sm btn-outline btn-primary mb-2';
  const categoryButtonClassNameActive =
    'btn btn-sm btn-outline btn-primary btn-active mb-2';

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

  return (
    <div>
      <div className="flex justify-between border-b border-warning mx-3">
        <div className="flex justify-start mt-1 gap-2">
          <button
            className={
              boardCategory == 'ALL'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('ALL')}
          >
            {t('Board.Category.All')}
          </button>
          <button
            className={
              boardCategory == 'STOCK'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('STOCK')}
          >
            {t('Board.Category.Stock')}
          </button>
          <button
            className={
              boardCategory == 'LIFE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('LIFE')}
          >
            {t('Board.Category.Life')}
          </button>
          <button
            className={
              boardCategory == 'QA'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('QA')}
          >
            {t('Board.Category.QA')}
          </button>
          <button
            className={
              boardCategory == 'NOTICE'
                ? categoryButtonClassNameActive
                : categoryButtonClassName
            }
            onClick={handleClickCategoryButton('NOTICE')}
          >
            {t('Board.Category.Notice')}
          </button>
        </div>
        <div className="flex justify-center mt-1 gap-2">
          <input
            type="text"
            name="tag"
            placeholder={t('Board.placeholder.tag') as string}
            value={tag}
            onChange={handleChangeTag}
            className="w-36 max-w-xs input input-bordered input-sm text-accent-content"
          />
          <div onClick={handleClickSearch}>
            <Search searchMode={searchMode} searchDisabled={searchDisabled} />
          </div>
        </div>
        <div className="flex justify-end mt-1 gap-1 text-secondary">
          <button
            className="btn btn-sm btn-ghost btn-circle"
            disabled={currentPage == 1}
            onClick={moveToFirstPage}
          >
            <i className="ri-skip-left-line ri-lg"></i>
          </button>
          <button
            className="btn btn-sm btn-ghost btn-circle"
            disabled={currentPage == 1}
            onClick={moveToPrevPage}
          >
            <i className="ri-arrow-left-s-line ri-lg"></i>
          </button>
          <span className="mt-1">
            {currentPage}/{totalPage}
          </span>
          <button
            className="btn btn-sm btn-ghost btn-circle"
            disabled={currentPage == totalPage}
            onClick={moveToNextPage}
          >
            <i className="ri-arrow-right-s-line ri-lg"></i>
          </button>
          <button
            className="btn btn-sm btn-ghost btn-circle"
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
            className="w-20 max-w-xs input input-bordered input-secondary input-sm text-accent-content"
          />
          <button
            className="btn btn-sm btn-ghost btn-circle"
            disabled={currentPage == targetPage}
            onClick={moveToTargetPage}
          >
            <i className="ri-corner-up-left-double-line ri-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Board);
