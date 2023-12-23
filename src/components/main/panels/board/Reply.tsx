import React, {FC, MouseEvent, useCallback, useEffect, useState} from 'react';
import {DateTime} from 'luxon';
import Editor from './Editor';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import {EditorRef, ReplyDTO} from '../BoardPage';
import {
  useDeleteBoardMutation,
  useDeleteReplyMutation,
  useLikeBoardMutation,
  useLikeReplyMutation
} from '../../../../app/api';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useTranslation} from 'react-i18next';

type ReplyProps = {
  memberId: string | null;
  panelId: string;
  parentNickname: string | null;
  replyDTO: ReplyDTO;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
  enableReplyEditor: (parentId: string | null) => (e: any) => void;
  resetReplyEditorState: () => void;
};

const Reply: FC<ReplyProps> = ({
  memberId,
  panelId,
  parentNickname,
  replyDTO,
  replyEditorRef,
  enableReplyEditor,
  resetReplyEditorState
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const [confirmDeleteReply, setConfirmDeleteReply] = useState<boolean>(false);

  const [like, setLike] = useState<boolean | null>(null);

  const [likeUpdated, setLikeUpdated] = useState<boolean>(false);

  const [
    requestReplyDelete,
    {isSuccess: isSuccessDelete, isError: isErrorDelete, reset: resetDelete}
  ] = useDeleteReplyMutation();

  const [requestReplyLike, {isSuccess: isSuccessLike, isError: isErrorLike}] =
    useLikeReplyMutation();

  const onClickLike = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLike(true);
  }, []);

  const onClickNotLike = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLike(false);
  }, []);

  const updateLike = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        const likeRequest = {
          id: replyDTO.replyId,
          number: like == true ? 1 : -1
        };
        await requestReplyLike(likeRequest);
        // await loadBoard(boardDTO.boardId, false);
      } catch (err) {
        console.log(err);
      }
    },
    [replyDTO.replyId, like, requestReplyLike]
  );

  const enableReplyEditorToModify = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const payload = {
        panelId: panelId,
        panelState: {
          showBoardEditor: true,
          boardId: boardDTO.boardId,
          nickname: boardDTO.nickname,
          title: boardDTO.title,
          boardCategory: boardDTO.boardCategory,
          preview: boardDTO.preview,
          content: JSON.parse(boardDTO.content as string),
          tag1: boardDTO.tag1,
          tag2: boardDTO.tag2,
          tag3: boardDTO.tag3
        }
      };
      dispatch(updatePanelState(payload));
      boardEditorRef.current?.setContent(
        JSON.parse(boardDTO.content as string)
      );
    },
    [
      dispatch,
      panelId,
      boardDTO.boardId,
      boardDTO.nickname,
      boardDTO.title,
      boardDTO.boardCategory,
      boardDTO.preview,
      boardDTO.content,
      boardDTO.tag1,
      boardDTO.tag2,
      boardDTO.tag3,
      boardEditorRef
    ]
  );

  const deleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteBoard(true);
  }, []);

  const cancelDeleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteBoard(false);
  }, []);

  const reallyDeleteReply = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await requestBoardDelete(boardDTO.boardId);
        await loadBoard(boardDTO.boardId, true);
      } catch (err) {
        console.log(err);
      }
    },
    [boardDTO.boardId, requestBoardDelete, loadBoard]
  );

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        setConfirmDeleteReply(false);
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [isSuccessDelete, isErrorDelete, resetDelete]);

  useEffect(() => {
    if (isSuccessLike) {
      setLikeUpdated(true);
    } else if (isErrorLike) {
      setLike(null);
      setLikeUpdated(true);
    }
  }, [isSuccessLike, isErrorLike]);

  return (
    <div className="border-b border-info my-2 mr-2">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          {parentNickname && (
            <>
              <i className="ri-reply-line ri-1x"></i>
              <span>parentNickname</span>
            </>
          )}
          <i className="ri-user-line ri-1x"></i>
          <button
            className={
              memberId == replyDTO.memberId
                ? 'text-sm text-primary btn-ghost rounded -mt-1 px-0.5'
                : 'text-sm text-info btn-ghost rounded -mt-1 px-0.5'
            }
          >
            {replyDTO?.nickname}
          </button>
        </div>
        <div className="flex justify-center mb-2 gap-2">
          <i className="ri-star-line ri-1x"></i>
          <div className="text-sm text-info">{replyDTO?.likeCount}</div>
          <div hidden={memberId == null}>
            <div className="flex gap-1">
              <div
                className={
                  like == null ? 'invisible -mt-1 mr-1' : 'visible -mt-1 mr-1'
                }
              >
                <button
                  onClick={updateLike}
                  disabled={likeUpdated}
                  className="btn btn-xs btn-circle btn-outline btn-warning"
                >
                  <i className="ri-arrow-left-double-line ri-1x"></i>
                </button>
              </div>
              <button
                disabled={likeUpdated}
                onClick={onClickLike}
                className={
                  like == true
                    ? 'btn btn-xs btn-circle btn-outline btn-accent btn-active'
                    : 'btn btn-xs btn-circle btn-outline btn-accent'
                }
              >
                <i className="ri-thumb-up-line ri-1x"></i>
              </button>
              <button
                disabled={likeUpdated}
                onClick={onClickNotLike}
                className={
                  like == false
                    ? 'btn btn-xs btn-circle btn-outline btn-error btn-active'
                    : 'btn btn-xs btn-circle btn-outline btn-error'
                }
              >
                <i className="ri-thumb-down-line ri-1x"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <i className="ri-time-line ri-1x"></i>
          <div className="text-sm text-info mx-1">
            {DateTime.fromISO(
              replyDTO?.modDate.split('.')[0] as string
            ).toFormat('HH:mm yyyy-MM-dd')}
          </div>
        </div>
      </div>
      <Editor
        initialContent={JSON.parse(replyDTO?.content as string)}
        // editorRef={boardEditorReadOnlyRef}
        editable={false}
      />
      <div className="flex justify-between my-1">
        <button
          disabled={memberId == null || boardPageState.showReplyEditor}
          onClick={enableReplyEditor(replyDTO.parentId)}
          className="btn btn-xs btn-circle btn-outline btn-warning m-1"
        >
          <i className="ri-reply-line ri-1x"></i>
        </button>
        <div className="justify-end">
          <div hidden={memberId != replyDTO.memberId || confirmDeleteReply}>
            <button
              disabled={boardPageState.showReplyEditor}
              className="btn btn-xs btn-circle btn-outline btn-accent m-1"
              onClick={enableReplyEditorToModify}
            >
              <i className="ri-edit-2-line ri-1x"></i>
            </button>
            <button
              disabled={boardPageState.showReplyEditor}
              className="btn btn-xs btn-circle btn-outline btn-error m-1"
              onClick={deleteReply}
            >
              <i className="ri-delete-bin-line ri-1x"></i>
            </button>
          </div>
          <div hidden={memberId != replyDTO.memberId || !confirmDeleteReply}>
            <button
              onClick={cancelDeleteReply}
              className="btn btn-xs btn-ghost mr-1"
            >
              {t('Common.Cancel')}
            </button>
            {isErrorDelete ? (
              <div className="ml-2.5 mr-3">
                <MaterialSymbolError size={19} />
              </div>
            ) : isSuccessDelete ? (
              <div className="ml-2.5 mr-3">
                <MaterialSymbolSuccess size={19} />
              </div>
            ) : (
              <button
                onClick={reallyDeleteReply}
                className="btn btn-xs btn-accent"
              >
                {t('Common.Delete')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Reply);
