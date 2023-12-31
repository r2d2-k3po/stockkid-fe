import React, {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect
} from 'react';
import {useTranslation} from 'react-i18next';
import Editor from './Editor';
import {RemirrorContentType, RemirrorJSON} from 'remirror';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {EditorRef} from './BoardDetail';
import {
  ReplySaveRequest,
  useModifyReplyMutation,
  useRegisterReplyMutation
} from '../../../../app/api';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import {BoardPageState} from '../../../../app/constants/panelInfo';

type ReplyEditorProps = {
  panelId: string;
  boardId: string;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  resetReplyEditorState: () => void;
};

const ReplyEditor: FC<ReplyEditorProps> = ({
  panelId,
  boardId,
  replyEditorRef,
  loadBoard,
  resetReplyEditorState
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const regexFinal = /^.{2,30}$/;

  const [
    requestReplyRegister,
    {
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      reset: resetRegister
    }
  ] = useRegisterReplyMutation();

  const [
    requestReplyModify,
    {isSuccess: isSuccessModify, isError: isErrorModify, reset: resetModify}
  ] = useModifyReplyMutation();

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const handleChangeNickname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^.{0,30}$/;
      if (regex.test(e.target.value)) {
        const payload = {
          panelId: panelId,
          panelState: {
            nickname: e.target.value.trim()
          }
        };
        dispatch(updatePanelState(payload));
      }
    },
    [dispatch, panelId]
  );

  const handleEditorChange = useCallback(
    (json: RemirrorJSON) => {
      const payload = {
        panelId: panelId,
        panelState: {
          preview: replyEditorRef.current?.getText({lineBreakDivider: ' '}),
          content: json
        }
      };
      dispatch(updatePanelState(payload));
    },
    [dispatch, panelId, replyEditorRef]
  );

  const onClickCancel = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      resetReplyEditorState();
    },
    [resetReplyEditorState]
  );

  const onClickSave = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        localStorage.setItem('nickname', boardPageState.nickname);
        const replySaveRequest: ReplySaveRequest = {
          boardId: boardId,
          replyId: boardPageState.replyId,
          parentId: boardPageState.parentId,
          nickname: boardPageState.nickname,
          content: JSON.stringify(boardPageState.content)
        };
        if (boardPageState.replyId == null) {
          await requestReplyRegister(replySaveRequest);
        } else {
          await requestReplyModify(replySaveRequest);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [
      boardId,
      boardPageState.parentId,
      boardPageState.nickname,
      boardPageState.replyId,
      boardPageState.content,
      requestReplyRegister,
      requestReplyModify
    ]
  );

  useEffect(() => {
    if (isSuccessRegister || isErrorRegister) {
      const id = setTimeout(() => {
        if (isSuccessRegister) {
          loadBoard(boardId, false);
          resetReplyEditorState();
        }
        resetRegister();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    boardId,
    loadBoard,
    isSuccessRegister,
    isErrorRegister,
    resetReplyEditorState,
    resetRegister
  ]);

  useEffect(() => {
    if (isSuccessModify || isErrorModify) {
      const id = setTimeout(() => {
        if (isSuccessModify) {
          loadBoard(boardId, false);
          resetReplyEditorState();
        }
        resetModify();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [
    boardId,
    loadBoard,
    isSuccessModify,
    isErrorModify,
    resetReplyEditorState,
    resetModify
  ]);

  return (
    <div className="pt-1 ml-7">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          <i className="ri-user-line ri-1x"></i>
          <input
            type="text"
            name="nickname"
            placeholder={t('Board.placeholder.nickname') as string}
            value={boardPageState.nickname}
            onChange={handleChangeNickname}
            className="w-28 max-w-xs input input-bordered input-secondary input-xs text-accent-content"
          />
        </div>
        <div className="flex justify-end mb-2">
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
                !regexFinal.test(boardPageState.nickname) ||
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
      <div className="my-0">
        <Editor
          onChange={handleEditorChange}
          initialContent={boardPageState.content}
          editorRef={replyEditorRef}
          editable={true}
        />
      </div>
    </div>
  );
};

export default React.memo(ReplyEditor);
