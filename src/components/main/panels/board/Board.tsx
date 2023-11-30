import React, {ChangeEvent, FC, MouseEvent, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {RemirrorJSON} from 'remirror';
import EditorReadOnly from './EditorReadOnly';

type BoardFormType = Record<
  'nickname' | 'title' | 'tag1' | 'tag2' | 'tag3',
  string
>;

type BoardProps = {
  setShowNewBoard?: React.Dispatch<React.SetStateAction<boolean>>;
  mode: 'register' | 'preview';
};

const Board: FC<BoardProps> = ({setShowNewBoard, mode}) => {
  const {t} = useTranslation();
  const regexFinal = /^.{2,30}$/;

  const [boardCategory, setBoardCategory] = useState<
    'STOCK' | 'LIFE' | 'QA' | 'NOTICE' | '0'
  >(
    (localStorage.getItem('boardCategory') as
      | 'STOCK'
      | 'LIFE'
      | 'QA'
      | 'NOTICE') || '0'
  );

  const [{nickname, title, tag1, tag2, tag3}, setBoardForm] =
    useState<BoardFormType>({
      nickname: localStorage.getItem('nickname') || '',
      title: localStorage.getItem('title') || '',
      tag1: localStorage.getItem('tag1') || '',
      tag2: localStorage.getItem('tag2') || '',
      tag3: localStorage.getItem('tag3') || ''
    });

  const handleChangeBoardForm = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        const valueTrim = e.target.value.trim();
        setBoardForm((obj) => ({...obj, [key]: valueTrim}));
        localStorage.setItem(key, valueTrim);
      }
    },
    []
  );

  const handleChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      setBoardCategory(e.target.value as 'STOCK' | 'LIFE' | 'QA' | 'NOTICE');
      localStorage.setItem('boardCategory', e.target.value);
    },
    []
  );

  const [initialContent] = useState<RemirrorJSON | undefined>(() => {
    if (mode == 'register') {
      const content = localStorage.getItem('initialContent');
      return content ? JSON.parse(content) : undefined;
    }
  });

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    window.localStorage.setItem('initialContent', JSON.stringify(json));
  }, []);

  const reset = useCallback(() => {
    if (setShowNewBoard) {
      localStorage.removeItem('boardCategory');
      localStorage.removeItem('initialContent');
      localStorage.removeItem('title');
      localStorage.removeItem('tag1');
      localStorage.removeItem('tag2');
      localStorage.removeItem('tag3');
      localStorage.setItem('showNewBoard', 'false');
      setBoardCategory('0');
      setBoardForm((obj) => ({
        ...obj,
        ['title']: '',
        ['tag1']: '',
        ['tag2']: '',
        ['tag3']: ''
      }));
      setShowNewBoard(false);
    }
  }, [setShowNewBoard]);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      reset();
    },
    [reset]
  );

  const onClickSave = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      reset();
    },
    [reset]
  );

  return (
    <div className="border-b border-warning my-2 mx-3">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          {mode == 'register' && (
            <input
              type="text"
              name="nickname"
              placeholder={t('Board.placeholder.nickname') as string}
              value={nickname}
              onChange={handleChangeBoardForm('nickname')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
          {mode != 'register' && <i className="ri-heart-line ri-1x"></i>}
        </div>
        <div className="flex justify-center">
          {mode == 'register' && (
            <input
              type="text"
              name="title"
              placeholder={t('Board.placeholder.title') as string}
              value={title}
              onChange={handleChangeBoardForm('title')}
              className="w-96 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
        </div>
        <div className="flex justify-end mb-2">
          {mode != 'register' && <i className="ri-time-line ri-1x"></i>}
          {mode == 'register' && (
            <select
              onChange={handleChangeCategory}
              className="max-w-xs select select-secondary select-xs text-accent-content mx-3"
              value={boardCategory}
            >
              <option disabled value="0">
                {t('BoardPage.Category.Category')}
              </option>
              <option value="STOCK">{t('BoardPage.Category.Stock')}</option>
              <option value="LIFE">{t('BoardPage.Category.Life')}</option>
              <option value="QA">{t('BoardPage.Category.QA')}</option>
              <option value="NOTICE">{t('BoardPage.Category.Notice')}</option>
            </select>
          )}
          {mode == 'register' && (
            <button
              // disabled={isLoadingSave || isLoadingLoad || isLoadingDefaultLoad}
              onClick={onClickCancel}
              className="btn btn-xs btn-ghost mr-1"
            >
              {t('Common.Cancel')}
            </button>
          )}
          {mode == 'register' && (
            <button
              disabled={
                boardCategory == '0' ||
                !regexFinal.test(nickname) ||
                !regexFinal.test(title)
              }
              onClick={onClickSave}
              className="btn btn-xs btn-accent"
              //   isLoadingSave || isLoadingLoad || isLoadingDefaultLoad
              //       ? 'btn btn-xs btn-accent loading'

              //
            >
              {t('Common.Save')}
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          {mode != 'register' && <i className="ri-eye-line ri-1x"></i>}
          {mode != 'register' && <i className="ri-chat-1-line ri-1x"></i>}
          {mode != 'register' && <i className="ri-star-line ri-1x"></i>}
        </div>
        <div className="flex justify-end mb-2 mr-24 gap-2">
          {mode == 'register' && (
            <input
              type="text"
              name="tag1"
              placeholder={t('Board.placeholder.tag1') as string}
              value={tag1}
              onChange={handleChangeBoardForm('tag1')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
          {mode == 'register' && (
            <input
              type="text"
              name="tag2"
              placeholder={t('Board.placeholder.tag2') as string}
              value={tag2}
              onChange={handleChangeBoardForm('tag2')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
          {mode == 'register' && (
            <input
              type="text"
              name="tag3"
              placeholder={t('Board.placeholder.tag3') as string}
              value={tag3}
              onChange={handleChangeBoardForm('tag3')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
        </div>
      </div>
      <Editor onChange={handleEditorChange} initialContent={initialContent} />
      {/*<EditorReadOnly initialContent={initialContent} />*/}
    </div>
  );
};

export default React.memo(Board);
