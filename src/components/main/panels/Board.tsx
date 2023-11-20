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
            className="w-full max-w-xs input input-bordered input-sm text-accent-content"
          />
          <div onClick={handleClickSearch}>
            <Search searchMode={searchMode} searchDisabled={searchDisabled} />
          </div>
        </div>
        <div
          className="flex justify-end mt-1 gap-2"
          onClick={handleClickSearch}
        >
          <Search searchMode={searchMode} searchDisabled={searchDisabled} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Board);
