import React, {ChangeEvent, FC, MouseEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {RemirrorJSON} from 'remirror';
import EditorReadOnly from './EditorReadOnly';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {BoardPageState} from '../BoardPage';
import {BoardSaveRequest, useRegisterBoardMutation} from '../../../../app/api';
import {getPreviewFromRemirrorJSON} from '../../../../utils/getPreviewFromRemirrorJSON';
import {initialContent} from '../../../../app/constants/panelInfo';

type BoardProps = {
  memberId: string | null;
  panelId: string;
  mode: 'register' | 'preview';
};

const Board: FC<BoardProps> = ({memberId, panelId, mode}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const [requestBoardRegister, {isSuccess, isError, reset}] =
    useRegisterBoardMutation();

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const handleChangeBoardForm = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        const payload = {
          panelId: panelId,
          panelState: {
            [key]: key == 'title' ? e.target.value : e.target.value.trim()
          }
        };
        dispatch(updatePanelState(payload));
      }
    },
    [dispatch, panelId]
  );

  const handleChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          boardCategory: e.target.value as 'STOCK' | 'LIFE' | 'QA' | 'NOTICE'
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const handleEditorChange = useCallback(
    (json: RemirrorJSON) => {
      const payload = {
        panelId: panelId,
        panelState: {
          preview: getPreviewFromRemirrorJSON(json),
          content: json
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const resetBoardState = useCallback(() => {
    const payload = {
      panelId: panelId,
      panelState: {
        showNewBoard: false,
        boardCategory: '0',
        title: '',
        tag1: '',
        tag2: '',
        tag3: '',
        preview: null,
        content: initialContent
      }
    };
    dispatch(updatePanelState(payload));
  }, [dispatch, panelId]);

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      resetBoardState();
    },
    [resetBoardState]
  );

  const onClickSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        localStorage.setItem('nickname', boardPageState.nickname);
        const boardResisterRequest: BoardSaveRequest = {
          boardId: null,
          boardCategory: boardPageState.boardCategory,
          nickname: boardPageState.nickname,
          title: boardPageState.title,
          preview: getPreviewFromRemirrorJSON(
            boardPageState.content as RemirrorJSON
          ) as string,
          content: JSON.stringify(boardPageState.content),
          tag1: boardPageState.tag1 || null,
          tag2: boardPageState.tag2 || null,
          tag3: boardPageState.tag3 || null
        };
        await requestBoardRegister(boardResisterRequest);
        resetBoardState();
      } catch (err) {
        console.log(err);
      }
    },
    [
      boardPageState.nickname,
      boardPageState.boardCategory,
      boardPageState.title,
      boardPageState.content,
      boardPageState.tag1,
      boardPageState.tag2,
      boardPageState.tag3,
      requestBoardRegister,
      resetBoardState
    ]
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
              value={boardPageState.nickname}
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
              value={boardPageState.title}
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
              value={boardPageState.boardCategory}
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
                boardPageState.boardCategory == '0' ||
                !regexFinal.test(boardPageState.nickname) ||
                !regexFinal.test(boardPageState.title) ||
                !boardPageState.preview
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
              value={boardPageState.tag1}
              onChange={handleChangeBoardForm('tag1')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
          {mode == 'register' && (
            <input
              type="text"
              name="tag2"
              placeholder={t('Board.placeholder.tag2') as string}
              value={boardPageState.tag2}
              onChange={handleChangeBoardForm('tag2')}
              className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
            />
          )}
          {mode == 'register' && (
            <input
              type="text"
              name="tag3"
              placeholder={t('Board.placeholder.tag3') as string}
              value={boardPageState.tag3}
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
