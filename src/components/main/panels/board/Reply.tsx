import React, {FC, MouseEvent, useCallback, useEffect, useState} from 'react';
import {DateTime} from 'luxon';
import Editor from './Editor';
import MaterialSymbolError from '../../../common/MaterialSymbolError';
import MaterialSymbolSuccess from '../../../common/MaterialSymbolSuccess';
import {EditorRef, ReplyDTO} from './BoardDetail';
import {
  useDeleteReplyMutation,
  useLikeReplyMutation
} from '../../../../app/api';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import {updatePanelState} from '../../../../app/slices/panelsSlice';
import {useTranslation} from 'react-i18next';

type ReplyProps = {
  memberId: string | null;
  panelId: string;
  boardId: string;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  parentNickname: string | null;
  replyDTO: ReplyDTO;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
  enableReplyEditor: (
    parentId: string | null
  ) => (e: MouseEvent<HTMLButtonElement>) => void;
};

const Reply: FC<ReplyProps> = ({
  memberId,
  panelId,
  boardId,
  loadBoard,
  parentNickname,
  replyDTO,
  replyEditorRef,
  enableReplyEditor
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
          showReplyEditor: true,
          parentId: replyDTO.parentId,
          replyId: replyDTO.replyId,
          nickname: replyDTO.nickname,
          content: JSON.parse(replyDTO.content as string)
        }
      };
      dispatch(updatePanelState(payload));
      replyEditorRef.current?.setContent(
        JSON.parse(replyDTO.content as string)
      );
    },
    [
      dispatch,
      panelId,
      replyDTO.parentId,
      replyDTO.replyId,
      replyDTO.nickname,
      replyDTO.content,
      replyEditorRef
    ]
  );

  const deleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteReply(true);
  }, []);

  const cancelDeleteReply = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConfirmDeleteReply(false);
  }, []);

  const reallyDeleteReply = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      try {
        await requestReplyDelete(replyDTO.replyId);
      } catch (err) {
        console.log(err);
      }
    },
    [requestReplyDelete, replyDTO.replyId]
  );

  useEffect(() => {
    if (isSuccessDelete || isErrorDelete) {
      const id = setTimeout(() => {
        if (isSuccessDelete) {
          loadBoard(boardId, false);
          setConfirmDeleteReply(false);
        }
        resetDelete();
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [boardId, loadBoard, isSuccessDelete, isErrorDelete, resetDelete]);

  useEffect(() => {
    if (isSuccessLike) {
      loadBoard(boardId, false);
      setLikeUpdated(true);
    } else if (isErrorLike) {
      setLike(null);
      setLikeUpdated(true);
    }
  }, [boardId, loadBoard, isSuccessLike, isErrorLike]);

  return (
    <div className="border-t border-info mb-2 mr-2 pt-2">
      <div className="flex justify-between">
        <div className="flex justify-start mb-2 gap-2">
          {parentNickname && (
            <div className="text-sm">
              <span>{parentNickname}</span>
              <i className="ri-reply-line ri-1x"></i>
            </div>
          )}
          <i className="ri-user-line ri-1x"></i>
          <button
            className={
              memberId == replyDTO.memberId
                ? 'text-sm text-primary btn-ghost rounded -mt-1 px-0.5 mr-3'
                : 'text-sm text-info btn-ghost rounded -mt-1 px-0.5 mr-3'
            }
          >
            {replyDTO?.nickname}
          </button>
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
          onClick={enableReplyEditor(replyDTO.replyId)}
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
