import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {RemirrorJSON} from 'remirror';

type BoardFormType = Record<
  'nickname' | 'title' | 'tag1' | 'tag2' | 'tag3',
  string
>;

type BoardProps = {
  setEditorMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const Board: FC<BoardProps> = ({setEditorMode}) => {
  const {t} = useTranslation();

  const [boardCategory, setBoardCategory] = useState<
    'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
  >('STOCK');

  const [{nickname, title, tag1, tag2, tag3}, setBoardForm] =
    useState<BoardFormType>({
      nickname: localStorage.getItem('nickname') || '',
      title: '',
      tag1: '',
      tag2: '',
      tag3: ''
    });

  const [initialContent] = useState<RemirrorJSON | undefined>(() => {
    const content = '';
    return content ? JSON.parse(content) : undefined;
  });

  const handleChangeBoardForm = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        setBoardForm((obj) => ({...obj, [key]: e.target.value.trim()}));
      }
    },
    []
  );

  const handleChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setBoardCategory(e.target.value as 'STOCK' | 'LIFE' | 'QA' | 'NOTICE');
    },
    []
  );

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    // window.localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
  }, []);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setEditorMode(false);
    },
    [setEditorMode]
  );

  const onClickSave = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      localStorage.setItem('nickname', nickname);
      setEditorMode(false);
    },
    [setEditorMode, nickname]
  );

  return (
    <div className="border-b border-warning my-2 mx-3">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          <input
            type="text"
            name="nickname"
            placeholder={t('Board.placeholder.nickname') as string}
            value={nickname}
            onChange={handleChangeBoardForm('nickname')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
          <i className="ri-heart-line ri-1x"></i>
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            name="title"
            placeholder={t('Board.placeholder.title') as string}
            value={title}
            onChange={handleChangeBoardForm('title')}
            className="w-96 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
        <div className="flex justify-end mb-2">
          <i className="ri-time-line ri-1x"></i>
          <select
            onChange={handleChangeCategory}
            className="max-w-xs select select-secondary select-xs text-accent-content mx-3"
            value={boardCategory}
          >
            <option value="STOCK">{t('BoardPage.Category.Stock')}</option>
            <option value="LIFE">{t('BoardPage.Category.Life')}</option>
            <option value="QA">{t('BoardPage.Category.QA')}</option>
            <option value="NOTICE">{t('BoardPage.Category.Notice')}</option>
          </select>
          <button
            // disabled={isLoadingSave || isLoadingLoad || isLoadingDefaultLoad}
            onClick={onClickCancel}
            className="btn btn-xs btn-ghost mr-1"
          >
            {t('Common.Cancel')}
          </button>
          <button
            // disabled={
            //     (currentTask == 'save' && !regexFinal.test(currentTitle)) ||
            //     (currentTask == 'load' && !regexFinal.test(loadedTitle))
            // }
            onClick={onClickSave}
            className="btn btn-xs btn-accent"
            //   isLoadingSave || isLoadingLoad || isLoadingDefaultLoad
            //       ? 'btn btn-xs btn-accent loading'

            //
          >
            {t('Common.Save')}
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-eye-line ri-1x"></i>
          <i className="ri-chat-1-line ri-1x"></i>
          <i className="ri-star-line ri-1x"></i>
        </div>
        <div className="flex justify-end mb-2 mr-24 gap-2">
          <input
            type="text"
            name="tag1"
            placeholder={t('Board.placeholder.tag1') as string}
            value={tag1}
            onChange={handleChangeBoardForm('tag1')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
          <input
            type="text"
            name="tag2"
            placeholder={t('Board.placeholder.tag2') as string}
            value={tag2}
            onChange={handleChangeBoardForm('tag2')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
          <input
            type="text"
            name="tag3"
            placeholder={t('Board.placeholder.tag3') as string}
            value={tag3}
            onChange={handleChangeBoardForm('tag3')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
      </div>
      <Editor onChange={handleEditorChange} initialContent={initialContent} />
    </div>
  );
};

export default React.memo(Board);
