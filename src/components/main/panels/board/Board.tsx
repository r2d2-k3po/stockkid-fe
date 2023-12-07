import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useRef
} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {EditorStateProps, RemirrorJSON} from 'remirror';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {BoardDTO, BoardPageState} from '../BoardPage';
import {BoardSaveRequest, useRegisterBoardMutation} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import EditorReadOnly from './EditorReadOnly';
import {DateTime} from 'luxon';

interface GetTextHelperOptions extends Partial<EditorStateProps> {
  lineBreakDivider?: string;
}

export interface EditorRef {
  clearContent: () => void;
  getText: ({lineBreakDivider}: GetTextHelperOptions) => string;
}

type BoardProps = {
  memberId?: string | null;
  memberRole: string | null;
  panelId: string;
  mode: 'register' | 'preview';
  boardDTO?: BoardDTO;
};

const Board: FC<BoardProps> = ({
  memberId,
  memberRole,
  panelId,
  mode,
  boardDTO
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const editorRef = useRef<EditorRef | null>(null);

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
          preview: editorRef.current?.getText({lineBreakDivider: ' '}),
          content: json
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId]
  );

  const resetBoardState = useCallback(() => {
    editorRef.current?.clearContent();
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
        content: undefined
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
          preview: editorRef.current?.getText({
            lineBreakDivider: ' '
          }) as string,
          content: JSON.stringify(boardPageState.content),
          tag1: boardPageState.tag1 || null,
          tag2: boardPageState.tag2 || null,
          tag3: boardPageState.tag3 || null
        };
        await requestBoardRegister(boardResisterRequest);
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
      requestBoardRegister
    ]
  );

  useEffect(() => {
    if (isSuccess || isError) {
      const id = setTimeout(() => {
        if (isSuccess) {
          resetBoardState();
        }
        reset();
      }, 3000);
      return () => clearTimeout(id);
    }
  }, [isSuccess, isError, resetBoardState, reset]);

  return (
    <div
      className={
        mode == 'register'
          ? 'border-b border-warning my-2 mx-3'
          : 'border-b border-warning my-2 mr-2'
      }
    >
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
          {mode == 'preview' && (
            <div className="text-sm text-info">{boardDTO?.nickname}</div>
          )}
          {mode == 'preview' && (
            <div className="text-md text-info ml-16">{boardDTO?.title}</div>
          )}
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
          {mode != 'register' && (
            <>
              <i className="ri-time-line ri-1x"></i>
              <div className="text-sm text-info mx-1">
                {DateTime.fromISO(
                  boardDTO?.regDate.split('.')[0] as string
                ).toFormat('HH:mm yyyy-MM-dd')}
              </div>
            </>
          )}
          {mode == 'register' && (
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
          )}
          {mode == 'preview' && (
            <div className="text-xs text-info text-center w-16 mx-2 border-[1px] border-secondary rounded-lg my-0.5">
              {t(`BoardPage.Category.${boardDTO?.boardCategory}`)}
            </div>
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
          {mode == 'register' &&
            (isError ? (
              <div className="ml-2.5 mr-3">
                <MaterialSymbolError size={19} />
              </div>
            ) : isSuccess ? (
              <div className="ml-2.5 mr-3">
                <MaterialSymbolSuccess size={19} />
              </div>
            ) : (
              <button
                disabled={
                  boardPageState.boardCategory == '0' ||
                  !regexFinal.test(boardPageState.nickname) ||
                  !regexFinal.test(boardPageState.title) ||
                  !(
                    boardPageState.preview &&
                    regexFinal.test(boardPageState.preview)
                  )
                }
                onClick={onClickSave}
                className="btn btn-xs btn-accent"
                //   isLoadingSave || isLoadingLoad || isLoadingDefaultLoad
                //       ? 'btn btn-xs btn-accent loading'

                //
              >
                {t('Common.Save')}
              </button>
            ))}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          {mode != 'register' && (
            <>
              <i className="ri-eye-line ri-1x"></i>
              <div className="text-sm text-info">{boardDTO?.readCount}</div>
            </>
          )}
          {mode != 'register' && (
            <>
              <i className="ri-chat-1-line ri-1x"></i>
              <div className="text-sm text-info">{boardDTO?.replyCount}</div>
            </>
          )}
          {mode != 'register' && (
            <>
              <i className="ri-star-line ri-1x"></i>
              <div className="text-sm text-info">{boardDTO?.likeCount}</div>
            </>
          )}
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
      {mode == 'preview' ? (
        <div className="mb-2 line-clamp-1 text-sm text-info">
          {boardDTO?.preview}
          {/*<EditorReadOnly*/}
          {/*  initialContent={JSON.parse(boardDTO?.preview as string)}*/}
          {/*/>*/}
        </div>
      ) : (
        <div className={mode == 'register' ? 'mb-2 mr-6' : 'mb-2'}>
          <Editor
            onChange={handleEditorChange}
            initialContent={boardPageState.content}
            ref={editorRef}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(Board);
