import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect
} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {RemirrorJSON} from 'remirror';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {EditorRef, IdDTO} from '../BoardPage';
import {
  BoardSaveRequest,
  useModifyBoardMutation,
  useRegisterBoardMutation
} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import {BoardPageState} from '../../../../app/constants/panelInfo';

type BoardEditorProps = {
  memberRole: string | null;
  panelId: string;
  boardEditorRef: React.MutableRefObject<EditorRef | null>;
  loadBoardPage: () => Promise<void>;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  resetBoardEditorState: () => void;
};

const BoardEditor: FC<BoardEditorProps> = ({
  memberRole,
  panelId,
  boardEditorRef,
  loadBoardPage,
  loadBoard,
  resetBoardEditorState
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const [
    requestBoardRegister,
    {
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      reset: resetRegister
    }
  ] = useRegisterBoardMutation();

  const [
    requestBoardModify,
    {isSuccess: isSuccessModify, isError: isErrorModify, reset: resetModify}
  ] = useModifyBoardMutation();

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
          preview: boardEditorRef.current?.getText({lineBreakDivider: ' '}),
          content: json
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, boardEditorRef]
  );

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      resetBoardEditorState();
    },
    [resetBoardEditorState]
  );

  const onClickSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        localStorage.setItem('nickname', boardPageState.nickname);
        const boardSaveRequest: BoardSaveRequest = {
          boardId: boardPageState.boardId,
          boardCategory: boardPageState.boardCategory,
          nickname: boardPageState.nickname,
          title: boardPageState.title,
          preview: boardPageState.preview as string,
          content: JSON.stringify(boardPageState.content),
          tag1: boardPageState.tag1 || null,
          tag2: boardPageState.tag2 || null,
          tag3: boardPageState.tag3 || null
        };
        if (boardPageState.boardId == null) {
          const data = await requestBoardRegister(boardSaveRequest).unwrap();
          const boardId = (data?.apiObj as IdDTO)?.id;
          if (
            boardPageState.currentPage != 1 ||
            (boardPageState.boardPageCategory != 'ALL' &&
              boardPageState.boardPageCategory !=
                boardPageState.boardCategory) ||
            boardPageState.sortBy != 'id'
          ) {
            const payload = {
              panelId: panelId,
              panelState: {
                currentPage: 1,
                sortBy: 'id',
                boardPageCategory:
                  boardPageState.boardPageCategory ==
                  boardPageState.boardCategory
                    ? boardPageState.boardCategory
                    : 'ALL'
              }
            };
            dispatch(updatePanelState(payload));
          }
          await loadBoardPage();
          await loadBoard(boardId, false);
        } else {
          await requestBoardModify(boardSaveRequest);
          await loadBoard(boardPageState.boardId, false);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      boardPageState.boardPageCategory,
      boardPageState.sortBy,
      boardPageState.currentPage,
      boardPageState.boardId,
      boardPageState.nickname,
      boardPageState.boardCategory,
      boardPageState.title,
      boardPageState.preview,
      boardPageState.content,
      boardPageState.tag1,
      boardPageState.tag2,
      boardPageState.tag3,
      requestBoardRegister,
      requestBoardModify,
      loadBoardPage,
      loadBoard,
      panelId,
      dispatch
    ]
  );

  useEffect(() => {
    if (isSuccessRegister || isErrorRegister) {
      const id = setTimeout(() => {
        if (isSuccessRegister) {
          resetBoardEditorState();
        }
        resetRegister();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    isSuccessRegister,
    isErrorRegister,
    resetBoardEditorState,
    resetRegister
  ]);

  useEffect(() => {
    if (isSuccessModify || isErrorModify) {
      const id = setTimeout(() => {
        if (isSuccessModify) {
          resetBoardEditorState();
        }
        resetModify();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [isSuccessModify, isErrorModify, resetBoardEditorState, resetModify]);

  return (
    <div className="my-2 mx-3">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          <input
            type="text"
            name="nickname"
            placeholder={t('Board.placeholder.nickname') as string}
            value={boardPageState.nickname}
            onChange={handleChangeBoardForm('nickname')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
        <div className="flex justify-center">
          <input
            type="text"
            name="title"
            placeholder={t('Board.placeholder.title') as string}
            value={boardPageState.title}
            onChange={handleChangeBoardForm('title')}
            className="w-96 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
        <div className="flex justify-end mb-2">
          <select
            onChange={handleChangeCategory}
            className="max-w-xs select select-secondary select-xs text-accent-content mx-3"
            value={boardPageState.boardCategory}
          >
            <option disabled value="0">
              {t('BoardPage.Category.Category')}
            </option>
            <option value="STOCK">{t('BoardPage.Category.STOCK')}</option>
            <option value="LIFE">{t('BoardPage.Category.LIFE')}</option>
            <option value="QA">{t('BoardPage.Category.QA')}</option>
            <option
              disabled={memberRole != 'ADMIN' && memberRole != 'STAFF'}
              value="NOTICE"
            >
              {t('BoardPage.Category.NOTICE')}
            </option>
          </select>
          <button onClick={onClickCancel} className="btn btn-xs btn-ghost mr-1">
            {t('Common.Cancel')}
          </button>
          {isErrorRegister || isErrorModify ? (
            <div className="ml-2.5 mr-3">
              <MaterialSymbolError size={19} />
            </div>
          ) : isSuccessRegister || isSuccessModify ? (
            <div className="ml-2.5 mr-3">
              <MaterialSymbolSuccess size={19} />
            </div>
          ) : (
            <button
              disabled={
                boardPageState.boardCategory == '0' ||
                !regexFinal.test(boardPageState.nickname) ||
                !regexFinal.test(boardPageState.title) ||
                !boardPageState.preview
              }
              onClick={onClickSave}
              className="btn btn-xs btn-accent"
            >
              {t('Common.Save')}
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2"></div>
        <div className="flex justify-end mb-2 mr-24 gap-2">
          <input
            type="text"
            name="tag1"
            placeholder={t('Board.placeholder.tag1') as string}
            value={boardPageState.tag1 ?? ''}
            onChange={handleChangeBoardForm('tag1')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
          <input
            type="text"
            name="tag2"
            placeholder={t('Board.placeholder.tag2') as string}
            value={boardPageState.tag2 ?? ''}
            onChange={handleChangeBoardForm('tag2')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
          <input
            type="text"
            name="tag3"
            placeholder={t('Board.placeholder.tag3') as string}
            value={boardPageState.tag3 ?? ''}
            onChange={handleChangeBoardForm('tag3')}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
      </div>
      <div className="my-2 mx-3 absolute left-0 right-0 top-36 bottom-0 overflow-y-auto">
        <Editor
          onChange={handleEditorChange}
          initialContent={boardPageState.content}
          editorRef={boardEditorRef}
          editable={true}
        />
      </div>
    </div>
  );
};

export default React.memo(BoardEditor);
